import Dexie from "dexie";
import cuid from "cuid";

abstract class AbstractEntity {
  constructor(public gid?: string) {
    gid ? (this.gid = gid) : (this.gid = cuid());
  }
  equals(e1: AbstractEntity, e2: AbstractEntity) {
    return e1.gid === e2.gid;
  }
}

export class Wallet extends AbstractEntity {
  constructor(
    public walletName: string,
    public balance: number,
    public seed: Uint8Array,
    gid?: string
  ) {
    super(gid);
    this.walletName = walletName;
    this.balance = balance;
    this.seed = seed;
  }
}

class AppDatabase extends Dexie {
  public wallets!: Dexie.Table<Wallet, string>;

  constructor() {
    super("WalletsDatabase");
    var db = this;

    db.version(1).stores({
      wallets: "++gid, walletName, balance, seed",
    });

    db.wallets = db.table("wallet");
  }
}

export var db = new AppDatabase();
