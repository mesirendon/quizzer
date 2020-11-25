// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;

contract Quiz {
    address owner;
    string desc;
    string encodedQuiz;
    uint8[] answers;
    mapping(address => StudentAnswer) studentAnswers;
    mapping(address => bool) readers;
    address[] students;

    struct StudentAnswer {
        uint8[] answers;
        string name;
        string id;
        uint8 hits;
    }

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

    modifier onlyValidators() {
        require(readers[msg.sender] || msg.sender == owner, 'You are not the owner of this quiz');
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

    function answerQuiz(string memory _name, string memory _id, uint8[] memory _answers) public {
        require(studentAnswers[msg.sender].answers.length == 0, 'You already answered this quiz, there are no chances left');
        uint8 _hits = 0;
        for (uint8 i = 0; i < answers.length; i++) {
            if (_answers[i] == answers[i])
                _hits += 1;
        }
        studentAnswers[msg.sender] = StudentAnswer({
        answers : _answers,
        name : _name,
        id : _id,
        hits : _hits
        });
        students.push(msg.sender);
    }

    function getScore() public view returns (uint8 hits, uint8 total) {
        total = uint8(answers.length);
        hits = studentAnswers[msg.sender].hits;
    }

    function getScores() public view onlyValidators returns (address[] memory addresses, uint8[] memory hits, uint8 total) {
        uint8[] memory _hits = new uint8[](students.length);
        for (uint8 i = 0; i < students.length; i++) {
            _hits[i] = studentAnswers[students[i]].hits;
        }
        addresses = students;
        hits = _hits;
        total = uint8(answers.length);
    }

    function getStudentInfo(address _student) public view onlyValidators returns (string memory name, string memory id, uint8 hits, uint8[] memory registeredAnswers, uint8 total) {
        name = studentAnswers[_student].name;
        id = studentAnswers[_student].id;
        hits = studentAnswers[_student].hits;
        registeredAnswers = studentAnswers[_student].answers;
        total = uint8(answers.length);
    }

    function registerReader(address _reader) public onlyOwner {
        readers[_reader] = true;
    }
}
