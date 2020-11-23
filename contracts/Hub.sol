// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;

import './Quiz.sol';

contract Hub {
    address payable owner;
    mapping(address => Quiz[]) quizzes;

    constructor() public {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, 'You are not the owner of this hub');
        _;
    }

    function isOwner() public view returns (bool) {
        return msg.sender == owner;
    }

    function newQuiz(
        string memory _description,
        string memory _encodedQuiz,
        uint8[] memory _answers
    ) public payable {
        require(msg.value == 0.05 ether, 'You are not paying the exact value of 0.05 eth');
        quizzes[msg.sender].push(
            new Quiz(_description, _encodedQuiz, _answers, msg.sender)
        );
    }

    function myQuizzes() public view returns (Quiz[] memory quizAddresses) {
        quizAddresses = quizzes[msg.sender];
    }

    function withdraw() public onlyOwner {
        owner.transfer(address(this).balance);
    }
}
