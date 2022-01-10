// SPDX-License-Identifier: MIT OR Apache-2.0

pragma solidity ^0.8.5;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/utils/cryptography/ECDSA.sol';
import '@openzeppelin/contracts/utils/math/SafeMath.sol';

contract VotingContract {
    using SafeMath for uint256;

    IERC20 public token;
    uint256 private voteDuration;

    bytes32 private constant EIP712DOMAIN_TYPEHASH =
        keccak256('EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)');
    bytes32 private constant VOTE_TYPEHASH =
        keccak256('Vote(uint256 proposalIdAndType,uint256 tokenAmount,address voter)');
    bytes32 private DOMAIN_SEPARATOR;

    struct Proposal {
        uint256 startBlock;
        uint256 endAt;
        string title;
        string description;
        uint256 totalVotesFor;
        uint256 totalVotesAgainst;
        uint256 id;
        address[] voters;
    }
    mapping(uint256 => mapping(address => bool)) private voted;
    Proposal[] public proposals;

    struct Vote {
        address voter;
        uint256 proposalIdAndType;
        uint256 tokenAmount;
        bytes32 r;
        bytes32 vs;
    }

    event VoteCast(uint256 roomId, address voter);
    event ProposalStarted(uint256 proposalId, string title);

    constructor(IERC20 _address, uint256 _voteDuration) {
        token = _address;
        voteDuration = _voteDuration;
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

    function getProposalsLength() public view returns (uint256) {
        return proposals.length;
    }

    function getLastNProposals(uint256 amount) public view returns (Proposal[] memory result) {
        if (amount == 0) {
            return new Proposal[](0);
        }
        uint256 proposalsLen = proposals.length;
        uint256 limit;
        if (amount > proposalsLen) {
            limit = 0;
        } else {
            limit = proposalsLen - amount;
        }
        uint256 i = proposalsLen;
        uint256 j = 0;
        result = new Proposal[](amount);
        while (i > 0 && i > limit) {
            result[j++] = proposals[--i];
        }
        if (j < amount) {
            assembly {
                mstore(result, sub(mload(result), sub(amount, j)))
            }
        }
    }

    function getProposalFromId(uint256 id) public view returns (Proposal[] memory result) {
        if (id + 1 > proposals.length) {
            return new Proposal[](0);
        }
        result = new Proposal[](proposals.length - id);
        uint256 i = id;
        uint256 j = 0;
        while (i < proposals.length) {
            result[j++] = proposals[i++];
        }
    }

    function getProposals() public view returns (Proposal[] memory) {
        return proposals;
    }

    function getOpenProposals() public view returns (Proposal[] memory result) {
        uint256 proposalsLen = proposals.length;
        uint256 i = proposalsLen;
        result = new Proposal[](proposalsLen);
        while (i > 0 && proposals[--i].endAt > block.timestamp) {
            result[proposals.length - 1 - i] = proposals[i];
            proposalsLen--;
        }
        assembly {
            mstore(result, sub(mload(result), proposalsLen))
        }
    }

    function listVotersForProposal(uint256 proposalId) public view returns (address[] memory) {
        require(proposalId < proposals.length, 'No proposal for this id');
        return proposals[proposalId].voters;
    }

    function initializeProposal(
        string calldata title,
        string calldata description,
        uint256 creatorVoteForAmount
    ) public {
        require(creatorVoteForAmount > 0, 'token amount must not be 0');
        require(
            token.balanceOf(msg.sender) >= creatorVoteForAmount,
            'sender does not have the amount of token they voted for'
        );
        Proposal memory proposal;
        proposal.startBlock = block.number;
        proposal.endAt = block.timestamp.add(voteDuration);
        proposal.title = title;
        proposal.description = description;
        proposal.totalVotesFor = creatorVoteForAmount;
        proposal.id = proposals.length;
        voted[proposals.length][msg.sender] = true;

        proposals.push(proposal);
        proposals[proposals.length - 1].voters.push(msg.sender);

        emit ProposalStarted(proposals.length - 1, title);
    }

    function verify(
        Vote calldata vote,
        bytes32 r,
        bytes32 vs
    ) internal view returns (bool) {
        bytes32 voteHash = keccak256(abi.encode(VOTE_TYPEHASH, vote.proposalIdAndType, vote.tokenAmount, vote.voter));
        bytes32 digest = keccak256(abi.encodePacked('\x19\x01', DOMAIN_SEPARATOR, voteHash));
        return ECDSA.recover(digest, r, vs) == vote.voter;
    }

    function castVote(Vote calldata vote, uint256 proposalId) internal {
        if (vote.proposalIdAndType & 1 == 1) {
            proposals[proposalId].totalVotesFor = proposals[proposalId].totalVotesFor.add(vote.tokenAmount);
        } else {
            proposals[proposalId].totalVotesAgainst = proposals[proposalId].totalVotesAgainst.add(vote.tokenAmount);
        }
        proposals[proposalId].voters.push(vote.voter);
        voted[proposalId][vote.voter] = true;
    }

    function castVotes(Vote[] calldata votes) public {
        for (uint256 i = 0; i < votes.length; i++) {
            Vote calldata vote = votes[i];
            uint256 proposalId = vote.proposalIdAndType >> 1;
            require(proposalId < proposals.length, 'proposal does not exist');
            require(proposals[proposalId].endAt > block.timestamp, 'vote closed for this proposal');
            require(voted[proposalId][vote.voter] == false, 'voter already voted');
            require(verify(vote, vote.r, vote.vs), 'vote has wrong signature');
            require(token.balanceOf(vote.voter) >= vote.tokenAmount, 'voter doesnt have enough tokens');
            castVote(vote, proposalId);
            emit VoteCast(proposalId, vote.voter);
        }
    }
}
