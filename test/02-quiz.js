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
  before(async () => {
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
    it('should allow the owner to get the score of all the students');
    it('should reject anyone trying to get the score of all the students');
    it('should allow a student to get their score');
  });
  describe
});
