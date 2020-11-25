const Quiz = artifacts.require('Quiz');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

const { expect } = chai;

contract('Quiz', (accounts) => {
  const [
    owner,
    student1,
    student2,
    student3,
    reader,
    unauthorized,
  ] = accounts;
  const description = 'Quiz 1';
  const quiz = [
    {
      statement: 'Question 1',
      options: ['Option 1', 'Option 2', 'Option 3'],
    },
    {
      statement: 'Question 2',
      options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
    },
  ];
  const answers = [1, 3];
  const encodedQuiz = web3.utils.utf8ToHex(JSON.stringify(quiz));
  let quizz;
  beforeEach(async () => {
    quizz = await Quiz.new(description, encodedQuiz, answers, owner);
  });
  describe('Informational', () => {
    it('should allow anyone to get the description and the questions', () => {
      return quizz.getInfo()
        .then(({ description, questions }) => [
          description,
          JSON.parse(web3.utils.hexToUtf8(questions)),
        ])
        .then(([desc, questions]) => {
          expect(desc).to.eq(description);
          expect(questions).to.deep.eq(quiz);
        });
    });
    it('should allow the owner to get the answers', () => {
      return quizz.getAnswers()
        .then((answers) => answers.map((answer) => Number(answer)))
        .then((registeredAswers) => {
          expect(registeredAswers).to.deep.eq(answers);
        });
    });
    it('should reject anyone trying to get the answers', () => {
      return expect(quizz.getAnswers({ from: unauthorized }))
        .to.be.eventually.rejectedWith('You are not the owner of this quiz');
    });
    it('should allow the owner to get the score of all the students', () => {
      return Promise.all([
        quizz.answerQuiz('Mario Perez', '123', [1, 0], { from: student1 }),
        quizz.answerQuiz('Maria Perez', '234', [0, 0], { from: student2 }),
        quizz.answerQuiz('Pedro Perez', '345', [1, 3], { from: student3 }),
      ])
        .then(() => quizz.getScores())
        .then(({ addresses, hits, total }) => [addresses, hits.map(x => (Number(x) / Number(total)))])
        .then(([[sa1, sa2, sa3], [s1, s2, s3]]) => {
          expect(sa1).to.eq(student1);
          expect(sa2).to.eq(student2);
          expect(sa3).to.eq(student3);
          expect(s1).to.eq(0.5);
          expect(s2).to.eq(0);
          expect(s3).to.eq(1);
        });
    });
    it('should reject anyone trying to get the score of all the students', async () => {
      await quizz.answerQuiz('Mario Perez', '123', [1, 0], { from: student1 });
      return expect(quizz.getScores({ from: unauthorized }))
        .to.be.eventually.rejectedWith('You are not the owner of this quiz');
    });
    it('should allow a student to get their score', () => {
      return quizz.answerQuiz('Mario Perez', '123', [1, 0], { from: student1 })
        .then(() => quizz.getScore({ from: student1 }))
        .then(({ hits, total }) => [Number(hits), Number(total)])
        .then(([hits, total]) => hits / total)
        .then((score) => {
          expect(score).to.eq(0.5);
        });
    });
    it('should allow the owner to get the information of a specific student', () => {
      return quizz.answerQuiz('Mario Perez', '123', [1, 0], { from: student1 })
        .then(() => quizz.getStudentInfo(student1))
        .then(({ name, id, hits, registeredAnswers, total }) => [name, id, (Number(hits) / Number(total)), registeredAnswers.map(x => Number(x))])
        .then(([name, id, hits, answers]) => {
          expect(name).to.eq('Mario Perez');
          expect(id).to.eq('123');
          expect(hits).to.eq(0.5);
          expect(answers).to.deep.eq([1, 0]);
        });
    });
    it('should avoid anyone reading information of a specific student', async () => {
      await quizz.answerQuiz('Mario Perez', '123', [1, 0], { from: student1 });
      return expect(quizz.getStudentInfo(student1, { from: reader }))
        .to.be.eventually.rejectedWith('You are not the owner of this quiz');
    });
    it('should allow a reader to get the score of all the students', () => {
      return Promise.all([
        quizz.answerQuiz('Mario Perez', '123', [1, 0], { from: student1 }),
        quizz.answerQuiz('Maria Perez', '234', [0, 0], { from: student2 }),
        quizz.answerQuiz('Pedro Perez', '345', [1, 3], { from: student3 }),
        quizz.registerReader(reader),
      ])
        .then(() => quizz.getScores({ from: reader }))
        .then(({ addresses, hits, total }) => [addresses, hits.map(x => (Number(x) / Number(total)))])
        .then(([[sa1, sa2, sa3], [s1, s2, s3]]) => {
          expect(sa1).to.eq(student1);
          expect(sa2).to.eq(student2);
          expect(sa3).to.eq(student3);
          expect(s1).to.eq(0.5);
          expect(s2).to.eq(0);
          expect(s3).to.eq(1);
        });
    });
    it('should allow a reader to get the information of a specific student', () => {
      return Promise.all([
        quizz.answerQuiz('Mario Perez', '123', [1, 0], { from: student1 }),
        quizz.registerReader(reader),
      ])
        .then(() => quizz.getStudentInfo(student1, { from: reader }))
        .then(({ name, id, hits, registeredAnswers, total }) => [name, id, (Number(hits) / Number(total)), registeredAnswers.map(x => Number(x))])
        .then(([name, id, hits, answers]) => {
          expect(name).to.eq('Mario Perez');
          expect(id).to.eq('123');
          expect(hits).to.eq(0.5);
          expect(answers).to.deep.eq([1, 0]);
        });
    });
  });
  describe('Student related', () => {
    it('should allow a student to send their answers', () => {
      return quizz.answerQuiz('Mario Perez', '123', [1, 0], { from: student1 })
        .then((result) => {
          expect(result.tx).to.match(/0x[a-fA-F0-9]{64}/);
        });
    });
    it('should not allow a student to resend answers to a quiz', async () => {
      await quizz.answerQuiz('Maria Perez', '321', [1, 0], { from: student2 });
      return expect(quizz.answerQuiz('Maria Perez', '321', [1, 3], { from: student2 }))
        .to.be.eventually.rejectedWith('You already answered this quiz, there are no chances left');
    });
  });
  describe('Operational', () => {
    it('should allow the owner to register readers', () => {
      return quizz.registerReader(reader)
        .then((result) => {
          expect(result.tx).to.match(/0x[a-fA-F0-9]{64}/);
        });
    });
    it('should avoid anyone to register a reader', () => {
      return expect(quizz.registerReader(reader, { from: unauthorized }))
        .to.be.eventually.rejectedWith('You are not the owner of this quiz');
    });
  });
});
