// SPDX-License-Identifier: MIT

pragma solidity ~0.8.0;

interface IConnext {
    struct CallParams {
        address to;
        bytes callData;
        uint32 originDomain;
        uint32 destinationDomain;
    }

    struct XCallArgs {
        CallParams params;
        address transactingAssetId; // Could be adopted, local, or wrapped
        uint256 amount;
    }

    function xcall(XCallArgs calldata _args) external payable returns (bytes32);
}
