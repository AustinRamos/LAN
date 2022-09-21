// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

//so shortcuts taken so far:
//naive implementation
//-trust assumptions

//contract will refer to this for a registry of all isntances of basebid.
// this is not an ideal solution, purely for time's sake.
//better design is to have the actual abstract BaseBid concept (too hard to debug really)
//but you still have to trust/verify. the contract. would be cool to have a tool to verify smart contract code.

//should come back to this time permitting

//like this is really bad. implicit trust assumption anyone can add to this with their implemented basebids which could do anything
//once approved to depoist... some hash bytecode verification makes it slightly better(which is possible )

contract BaseBidRegistry{

mapping (uint256=>address) baseBids;
uint256 public count;

constructor(){
    count=0;
}

function getBaseBids(uint256 _count) public view returns (address) {
return baseBids[_count];
}

//some sort of vetting process here.... tbh factory pattern is a ton simpler but slightly defeats the point
function addBaseBid(address baseBid) public {
    baseBids[count] = baseBid;
    count++;
}

}