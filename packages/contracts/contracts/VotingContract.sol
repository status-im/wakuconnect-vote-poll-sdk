pragma solidity ^0.8.5;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/utils/cryptography/ECDSA.sol';
import '@openzeppelin/contracts/utils/math/SafeMath.sol';

contract VotingContract {
    using SafeMath for uint256;

    IERC20 public token;
    uint256 private votingLength;

    bytes32 private constant EIP712DOMAIN_TYPEHASH =
        keccak256('EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)');
    bytes32 private constant VOTE_TYPEHASH = keccak256('Vote(uint256 roomIdAndType,uint256 tokenAmount,address voter)');
    bytes32 private DOMAIN_SEPARATOR;

    struct VotingRoom {
        uint256 startBlock;
        uint256 endAt;
        string question;
        string description;
        uint256 totalVotesFor;
        uint256 totalVotesAgainst;
        address[] voters;
    }
    mapping(uint256 => mapping(address => bool)) private voted;
    VotingRoom[] public votingRooms;

    struct Vote {
        address voter;
        uint256 roomIdAndType;
        uint256 tokenAmount;
        bytes32 r;
        bytes32 vs;
    }

    event VoteCast(uint256 roomId, address voter);
    event VotingRoomStarted(uint256 roomId, string question);

    constructor(IERC20 _address, uint256 _votingLength) {
        token = _address;
        votingLength = _votingLength;
        DOMAIN_SEPARATOR = keccak256(
            abi.encode(
                EIP712DOMAIN_TYPEHASH,
                keccak256(bytes('Voting Contract')),
                keccak256(bytes('1')),
                block.chainid,
                address(this)
            )
        );
    }

    function getVotingRooms() public view returns (VotingRoom[] memory) {
        return votingRooms;
    }

    function getOngoingVotingRooms() public view returns (VotingRoom[] memory result) {
        uint256 votingRoomsLen = votingRooms.length;
        uint256 i = votingRoomsLen;
        result = new VotingRoom[](votingRoomsLen);
        while (i > 0 && votingRooms[--i].endAt > block.timestamp) {
            result[votingRooms.length - 1 - i] = votingRooms[i];
            votingRoomsLen--;
        }
        assembly {
            mstore(result, sub(mload(result), votingRoomsLen))
        }
    }

    function listRoomVoters(uint256 roomId) public view returns (address[] memory) {
        require(roomId < votingRooms.length, 'No room');
        return votingRooms[roomId].voters;
    }

    function initializeVotingRoom(
        string calldata question,
        string calldata description,
        uint256 voteAmount
    ) public {
        require(token.balanceOf(msg.sender) >= voteAmount, 'not enough token');
        VotingRoom memory newVotingRoom;
        newVotingRoom.startBlock = block.number;
        newVotingRoom.endAt = block.timestamp.add(votingLength);
        newVotingRoom.question = question;
        newVotingRoom.description = description;
        newVotingRoom.totalVotesFor = voteAmount;
        voted[votingRooms.length][msg.sender] = true;

        votingRooms.push(newVotingRoom);
        votingRooms[votingRooms.length - 1].voters.push(msg.sender);

        emit VotingRoomStarted(votingRooms.length - 1, question);
    }

    function verify(
        Vote calldata vote,
        bytes32 r,
        bytes32 vs
    ) internal view returns (bool) {
        bytes32 voteHash = keccak256(abi.encode(VOTE_TYPEHASH, vote.roomIdAndType, vote.tokenAmount, vote.voter));
        bytes32 digest = keccak256(abi.encodePacked('\x19\x01', DOMAIN_SEPARATOR, voteHash));
        return ECDSA.recover(digest, r, vs) == vote.voter;
    }

    function updateRoomVotes(Vote calldata vote, uint256 roomId) internal {
        if (vote.roomIdAndType & 1 == 1) {
            votingRooms[roomId].totalVotesFor = votingRooms[roomId].totalVotesFor.add(vote.tokenAmount);
        } else {
            votingRooms[roomId].totalVotesAgainst = votingRooms[roomId].totalVotesAgainst.add(vote.tokenAmount);
        }
        votingRooms[roomId].voters.push(vote.voter);
        voted[roomId][vote.voter] = true;
    }

    function castVotes(Vote[] calldata votes) public {
        for (uint256 i = 0; i < votes.length; i++) {
            Vote calldata vote = votes[i];
            uint256 roomId = vote.roomIdAndType >> 1;
            require(roomId < votingRooms.length, 'vote not found');
            require(votingRooms[roomId].endAt > block.timestamp, 'vote closed');
            require(verify(vote, vote.r, vote.vs), 'vote has wrong signature');
            require(voted[roomId][vote.voter] == false, 'voter already voted');
            require(token.balanceOf(vote.voter) >= vote.tokenAmount, 'voter doesnt have enough tokens');
            updateRoomVotes(vote, roomId);
            emit VoteCast(roomId, vote.voter);
        }
    }
}
