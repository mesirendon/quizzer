// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;

contract Quiz {
    address owner;
    string desc;
    string encodedQuiz;
    uint8[] answers;

    constructor(
        string memory _description,
        string memory _encodedQuiz,
        uint8[] memory _answers,
        address _owner
    ) public {
        owner = _owner;
        desc = _description;
        encodedQuiz = _encodedQuiz;
        answers = _answers;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, 'You are not the owner of this quiz');
        _;
    }

    function getInfo() public view returns (
        string memory description,
        string memory questions
    ) {
        description = desc;
        questions = encodedQuiz;
    }

    function getAnswers() public view onlyOwner returns (uint8[] memory) {
        return answers;
    }
}
