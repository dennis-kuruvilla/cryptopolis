pragma solidity ^0.5.0;

contract LandRecords{
    uint public recordCount = 0;

    struct Record {
    uint Rid;
    uint Cid;
    string Owner;
    string Address;
    uint Sqfeet;
    uint Lid;
  }
   
  mapping(uint => Record) public records;

  constructor() public {
        createRecord(0,"Jane Doe","ABC lane,XYZ PO,PQR",100);
      }

  function createRecord(uint _cid,string memory _owner,string memory _address,uint _sqfeet) public {
    recordCount ++;
    records[recordCount] = Record(recordCount,_cid,_owner,_address,_sqfeet,0);
    
  }
}