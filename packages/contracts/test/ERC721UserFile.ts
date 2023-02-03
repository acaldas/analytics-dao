import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { ERC721UserFile__factory } from "../types";

describe("UserFile", function () {
  async function deployContracts() {
    const ERC721Factory: ERC721UserFile__factory =
      await ethers.getContractFactory("ERC721UserFile");
    const ERC721UserFile = await ERC721Factory.deploy();

    return {
      ERC721UserFile,
    };
  }

  describe("ERC721", function () {
    it("Should mint for user", async function () {
      const { ERC721UserFile } = await loadFixture(deployContracts);
      const [, acc1, acc2] = await ethers.getSigners();
      await ERC721UserFile.mint(acc1.address, "");
      await ERC721UserFile.mint(acc2.address, "");

      expect(await ERC721UserFile.balanceOf(acc1.address))
        .to.equal(await ERC721UserFile.balanceOf(acc2.address))
        .to.equal(1);
    });

    it("Should set event count", async function () {
      const { ERC721UserFile } = await loadFixture(deployContracts);
      const [, acc1] = await ethers.getSigners();
      await ERC721UserFile.mint(acc1.address, "");

      await ERC721UserFile.setUserFileEventCount(
        0,
        [
          ethers.utils.formatBytes32String("host1"),
          ethers.utils.formatBytes32String("host2"),
        ],
        [1, 2]
      );
      const defaultPrice = ethers.utils.parseEther("0.3");
      expect(await ERC721UserFile.getUserFilePrice(0)).to.equal(defaultPrice);
    });

    it("Should add user access", async function () {
      const { ERC721UserFile } = await loadFixture(deployContracts);
      const [, acc1, acc2] = await ethers.getSigners();
      await ERC721UserFile.mint(acc1.address, "");

      await ERC721UserFile.setUserFileEventCount(
        0,
        [
          ethers.utils.formatBytes32String("host1"),
          ethers.utils.formatBytes32String("host2"),
        ],
        [1, 2]
      );
      await ERC721UserFile.connect(acc2).addUserFileAccess(0, {
        value: ethers.utils.parseEther("0.3"),
      });
      expect(await ERC721UserFile.connect(acc2).hasUserFileAccess(0)).to.equal(
        true
      );
    });

    it("Should prevent adding access before event count is set", async function () {
      const { ERC721UserFile } = await loadFixture(deployContracts);
      const [, acc1] = await ethers.getSigners();
      await ERC721UserFile.mint(acc1.address, "");
      await expect(ERC721UserFile.addUserFileAccess(0)).to.be.revertedWith(
        "File events count not set"
      );
    });

    it("Should reduce adding user access if insufficient funds", async function () {
      const { ERC721UserFile } = await loadFixture(deployContracts);
      const [, acc1, acc2] = await ethers.getSigners();
      await ERC721UserFile.mint(acc1.address, "");

      await ERC721UserFile.setUserFileEventCount(
        0,
        [
          ethers.utils.formatBytes32String("host1"),
          ethers.utils.formatBytes32String("host2"),
        ],
        [1, 2]
      );

      await expect(
        ERC721UserFile.connect(acc2).addUserFileAccess(0, {
          value: ethers.utils.parseEther("0.2"),
        })
      ).to.be.revertedWith("Not enough funds");
    });

    it("Should distribute earnings to nft owner", async function () {
      const { ERC721UserFile } = await loadFixture(deployContracts);
      const [, acc1, acc2] = await ethers.getSigners();
      await ERC721UserFile.mint(acc1.address, "");

      const initialBalance = await acc1.getBalance();
      const price = ethers.utils.parseEther("0.3");

      await ERC721UserFile.setUserFileEventCount(
        0,
        [
          ethers.utils.formatBytes32String("host1"),
          ethers.utils.formatBytes32String("host2"),
        ],
        [1, 2]
      );
      await ERC721UserFile.connect(acc2).addUserFileAccess(0, {
        value: price,
      });
      expect(await acc1.getBalance()).to.equal(initialBalance.add(price));
    });

    it("Should calculate price of multiple files", async function () {
      const { ERC721UserFile } = await loadFixture(deployContracts);
      const [, acc1, acc2, acc3] = await ethers.getSigners();
      await ERC721UserFile.mint(acc1.address, "");
      await ERC721UserFile.mint(acc2.address, "");

      await ERC721UserFile.setUserFileEventCount(
        0,
        [
          ethers.utils.formatBytes32String("host1"),
          ethers.utils.formatBytes32String("host2"),
        ],
        [1, 2]
      );
      await ERC721UserFile.setUserFileEventCount(
        1,
        [
          ethers.utils.formatBytes32String("host1"),
          ethers.utils.formatBytes32String("host2"),
        ],
        [1, 1]
      );
      const price1 = ethers.utils.parseEther("0.3");
      const price2 = ethers.utils.parseEther("0.2");
      const total = await ERC721UserFile.getMultipleUserFilePrice([0, 1]);
      expect(total[1][0]).to.equal(price1);
      expect(total[1][1]).to.equal(price2);
      expect(total[0]).to.equal(price1.add(price2));
    });

    it("Should distribute funds to all accessed files", async function () {
      const { ERC721UserFile } = await loadFixture(deployContracts);
      const [, acc1, acc2, acc3] = await ethers.getSigners();
      await ERC721UserFile.mint(acc1.address, "");
      await ERC721UserFile.mint(acc2.address, "");

      await ERC721UserFile.setUserFileEventCount(
        0,
        [
          ethers.utils.formatBytes32String("host1"),
          ethers.utils.formatBytes32String("host2"),
        ],
        [1, 2]
      );
      await ERC721UserFile.setUserFileEventCount(
        1,
        [
          ethers.utils.formatBytes32String("host1"),
          ethers.utils.formatBytes32String("host2"),
        ],
        [1, 1]
      );
      const price1 = ethers.utils.parseEther("0.3");
      const price2 = ethers.utils.parseEther("0.2");

      const initialBalance1 = await acc1.getBalance();
      const initialBalance2 = await acc2.getBalance();

      await ERC721UserFile.connect(acc3).addMultipleUserFileAccess([0, 1], {
        value: price1.add(price2),
      });
      expect(await acc1.getBalance()).to.equal(initialBalance1.add(price1));
      expect(await acc2.getBalance()).to.equal(initialBalance2.add(price2));
    });
  });
});
