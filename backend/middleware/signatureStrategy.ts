import { getPkhfromPk, validateAddress, verifySignature } from "@taquito/utils";
import passportCustom from "passport-custom";
const CustomStrategy = passportCustom.Strategy;
import { payloadBytesFromString } from "../lib/challenge";
import passport from "passport";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface User {
      pkh: string;
    }
  }
}
passport.serializeUser(function (user, done) {
  done(null, user.pkh);
});

passport.deserializeUser(function (id, done) {
  done(null, { pkh: id as string });
});

const strategy = new CustomStrategy(function (req, done) {
  console.log(JSON.stringify(req.body));

  const pk = req.body.pk;
  const pkh = req.body.pkh;
  const challenge = req.body.challenge;
  const signature = req.body.signature;

  if (!pk || !pkh || !challenge || !signature) {
    return done("PK, PKH, CHALLENGE, or SIG missing");
  }

  console.log("AUTHORIZING pkh=" + pkh);

  if (validateAddress(pkh as string) != 3) {
    return done("PKH is not a valid PKH");
  }

  const isVerified = verifySignature(
    payloadBytesFromString(challenge),
    pk as string,
    signature as string,
  );

  if (!isVerified) {
    return done("Invalid signature");
  }

  if (getPkhfromPk(pk as string) !== pkh) {
    return done("PK and PKH do not match");
  }

  //TODO: pull url from env
  const dappUrl = "gx-credentials.example.com";
  const input = "GX Credentials Login";
  const inputSplit = (challenge as string).substring(22).split(" ");

  if (
    dappUrl !== inputSplit[0] ||
    input !== [inputSplit[2], inputSplit[3], inputSplit[4]].join(" ")
  ) {
    return done("Invalid challenge");
  }

  const timeError =
    (new Date().getTime() - new Date(inputSplit[1]).getTime()) / 1000;
  if (timeError < 0 || timeError > 60) {
    return done("Invalid challenge");
  }

  return done(null, { pkh });
});

export default strategy;
