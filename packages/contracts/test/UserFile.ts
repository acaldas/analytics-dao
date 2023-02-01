import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { deployContracts } from "../scripts/deploy";
import {
  ERC721UserFile__factory,
  UserFile,
  UserFile__factory,
  UserFileFactory__factory,
} from "../types";

describe("UserFile", function () {
  async function deployContracts() {
    const UserFile: UserFile__factory = await ethers.getContractFactory(
      "UserFile"
    );
    const UserFileFactory: UserFileFactory__factory =
      await ethers.getContractFactory("UserFileFactory");
    const masterUserFile = await UserFile.deploy();

    await masterUserFile.deployed();

    const factory = await UserFileFactory.deploy(masterUserFile.address);
    await factory.deployed();

    const ERC721Factory: ERC721UserFile__factory =
      await ethers.getContractFactory("ERC721UserFile");
    const ERC721UserFile = await ERC721Factory.deploy();

    return {
      factory,
      masterUserFile,
      UserFileFactory,
      UserFile,
      ERC721UserFile,
    };
  }

  describe("Deployment", function () {
    it("Should set the master user file contract in the factory", async function () {
      const { factory, masterUserFile } = await loadFixture(deployContracts);

      expect(await factory.getMasterContract()).to.equal(
        masterUserFile.address
      );
    });

    it("Should set the factory owner", async function () {
      const { factory, ERC721UserFile } = await loadFixture(deployContracts);
      const [owner] = await ethers.getSigners();
      expect(await factory.owner()).to.equal(owner.address);
      expect(await ERC721UserFile.owner()).to.equal(owner.address);
    });
  });

  describe("File creation", function () {
    it("Should create user file", async function () {
      const { factory, ERC721UserFile } = await loadFixture(deployContracts);
      const [, acc1] = await ethers.getSigners();
      await factory.createUserFile(acc1.address);
      expect((await factory.getUserFiles(acc1.address)).length).to.equal(1);

      await ERC721UserFile.mint(acc1.address, "test");
      expect(await ERC721UserFile.balanceOf(acc1.address)).to.equal(1);

      expect(
        await ERC721UserFile.tokenOfOwnerByIndex(acc1.address, 0)
      ).to.equal(0);

      expect(await ERC721UserFile.tokenURI(0)).to.equal("test");
    });

    it("Should assign user to user file", async function () {
      const { factory, UserFile } = await loadFixture(deployContracts);
      const [, acc1] = await ethers.getSigners();
      await factory.createUserFile(acc1.address);
      const userFiles = await factory.getUserFiles(acc1.address);
      const userFileContract = UserFile.attach(userFiles[0]);
      expect(await userFileContract.getUser()).to.equal(acc1.address);
    });

    it("Should revert with the right error if called from another account", async function () {
      const { factory } = await loadFixture(deployContracts);
      const [, acc1] = await ethers.getSigners();
      await expect(
        factory.connect(acc1).createUserFile(acc1.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Events", function () {
    it("Should emit UserFileCreated", async function () {
      const { factory } = await loadFixture(deployContracts);
      const [acc1] = await ethers.getSigners();
      await factory.createUserFile(acc1.address);
      expect(factory.createUserFile(acc1.address))
        .to.emit(factory, "UserFileCreated")
        .withArgs(anyValue, acc1.address);
    });
  });
});
