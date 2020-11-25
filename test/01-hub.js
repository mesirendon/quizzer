const Hub = artifacts.require('Hub');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

const { expect } = chai;

contract('Hub', (accounts) => {
  const [
    owner,
    unauthorized,
  ] = accounts;
  describe('Deployment', () => {
    it('should deploy and register the owner', () => {
      return Hub.deployed()
        .then((hub) => hub.isOwner())
        .then((isOwner) => {
          expect(isOwner).to.be.true;
        });
    });
  });
  describe('Operational', () => {
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
    let hub;
    beforeEach(async () => {
      hub = await Hub.new();
    });
    it('should allow anyone to register a new Quiz paying its value', () => {
      const description = 'Quiz 1';
      return hub.newQuiz(
        description,
        encodedQuiz,
        answers,
        { value: web3.utils.toWei('0.05') },
      )
        .then((result) => {
          expect(result.tx).to.match(/0x[a-fA-F0-9]{64}/);
          return hub.myQuizzes();
        })
        .then((quizzes) => {
          expect(quizzes.length).to.be.at.least(1);
          expect(quizzes[0]).to.match(/0x[a-fA-F0-9]{40}/);
        });
    });
    it('should fail if the 0.05 eth is not payed', () => {
      const description = 'Quiz 1';
      return expect(hub.newQuiz(
        description,
        encodedQuiz,
        answers,
        { value: web3.utils.toWei('0.04') },
      ))
        .to.be.eventually.rejectedWith('You are not paying the exact value of 0.05 eth');
    });
    it('should allow the owner to retrieve the funds of the hub', () => {
      const description = 'Quiz 1';
      return hub.newQuiz(
        description,
        encodedQuiz,
        answers,
        { value: web3.utils.toWei('0.05') },
      )
        .then((result) => {
          expect(result.tx).to.match(/0x[a-fA-F0-9]{64}/);
          return hub.withdraw();
        })
        .then((result) => {
          expect(result.tx).to.match(/0x[a-fA-F0-9]{64}/);
        });
    });
    it('should fail if anyone tries to retrieve the funds of the hub', () => {
      return expect(hub.withdraw({ from: unauthorized }))
        .to.be.eventually.rejectedWith('You are not the owner of this hub');
    });
  });
});
