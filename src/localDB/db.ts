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
  mints!: Mint[];

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

    Object.defineProperties(this, {
      mints: { value: [], enumerable: false, writable: true },
    });
  }
}

export class Mint extends AbstractEntity {
  constructor(public walletId: string, public mint: string, gid?: string) {
    super(gid);
  }
}

class AppDatabase extends Dexie {
  public wallets!: Dexie.Table<Wallet, string>;
  public mints!: Dexie.Table<Mint, string>;

  constructor() {
    super("WalletsDatabase");
    var db = this;

    db.version(1).stores({
      wallets: "&gid, walletName, balance, seed",
      mints: "&gid, walletId, mint",
    });

    db.wallets = db.table("wallets");
    db.mints = db.table("mints");
  }
}

export var db = new AppDatabase();
