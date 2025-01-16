"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const SignUP = () => {
  const router = useRouter();
  const [usernameInputValue, setUsernameInputValue] = useState<string>("");
  const [usernameInvalid, setUsernameInvalid] = useState("");
  const [usernameErr, setUsernameErr] = useState(false);
  const [passInputValue, setPassInputValue] = useState<string>("");
  const [passInvalid, setPassInvalid] = useState("");
  const [passErr, setPassErr] = useState(false);
  const [emailORPhoneInputValue, setEmailORPhoneInputValue] =
    useState<string>("");
  const [emailInvalid, setEmailInvalid] = useState("");
  const [emailErr, setEmailErr] = useState(false);
  const [bioValue, setBioValue] = useState("");
  const [bioInvalid, setBioInvalid] = useState("");
  const [bioERR, setBioERR] = useState(false);

  const HandleUsernameValue = (e: { target: { value: string } }) => {
    setUsernameInputValue(e.target.value);
  };
  const HandelUserErr = () => {
    if (usernameInputValue === "") {
      setUsernameErr(true);
      setUsernameInvalid("write something");
      if (usernameInputValue.length < 8) {
        setUsernameErr(true);
        setUsernameInvalid("too short");
      }
    } else {
      if (usernameInputValue.length < 8) {
        setUsernameErr(true);
        setUsernameInvalid("too short");
      } else {
        setUsernameErr(false);
      }
    }
  };
  useEffect(() => {
    HandelUserErr();
  }, [usernameInputValue]);

  const HandlePassValue = (e: { target: { value: string } }) => {
    setPassInputValue(e.target.value);
  };

  const HandelPassErr = () => {
    if (passInputValue === "") {
      setPassErr(true);
      setPassInvalid("write something");
      if (passInputValue.length < 8) {
        setPassErr(true);
        setPassInvalid("too short");
      }
    } else {
      if (passInputValue.length < 8) {
        setPassErr(true);
        setPassInvalid("too short");
      } else {
        setPassErr(false);
      }
    }
  };
  useEffect(() => {
    HandelPassErr();
  }, [passInputValue]);

  const HandleEmailORPhoneValue = (e: { target: { value: string } }) => {
    setEmailORPhoneInputValue(e.target.value);
  };
  const HandleBioValue = (e: { target: { value: string } }) => {
    setBioValue(e.target.value);
  };
  const HandleEmailErr = () => {
    if (emailORPhoneInputValue === "") {
      setEmailErr(true);
      setEmailInvalid("write something");
    } else {
      if (emailORPhoneInputValue.includes("@")) {
        setEmailErr(false);
      } else {
        setEmailErr(true);
        setEmailInvalid("your email or phone number is invalid");
      }
    }
  };
  useEffect(() => {
    HandleEmailErr();
  }, [emailORPhoneInputValue]);
  const HandleBioErr = () => {
    if (bioValue === "") {
      setBioERR(true);
      setBioInvalid("write something");
    } else {
      setBioERR(false);
    }
  };
  useEffect(() => {
    HandleBioErr();
  }, [bioValue]);

  const ClikedOnSubmit = async () => {
    if (
      emailORPhoneInputValue !== "" &&
      passInputValue !== "" &&
      usernameInputValue !== "" &&
      bioValue !== ""
    ) {
      const NewBody = {
        email: emailORPhoneInputValue,
        password: passInputValue,
        username: usernameInputValue,
        bio: bioValue,
        profileIMG: "Hello",
      };

      const response = await fetch(
        "https://ig-backend-ix9h.onrender.com/sign-up",
        {
          method: "POST",

          body: JSON.stringify(NewBody),
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await response.json();

      localStorage.setItem("accessToken", data.token);
      router.push("/posts");
    } else {
      setBioERR(true);
      setBioInvalid("Please make sure all the fields are filled");
    }
  };

  const HandleLogiin = () => {
    router.push("/login");
  };
  return (
    <div className="h-screen bg-black w-screen flex justify-center items-center">
      <Card
        className="bg-black px-7 flex flex-col items w-min h-3/5 
      "
      >
        <CardHeader>
          <CardTitle className="flex flex-col justify-center">
            <img
              className="h-20"
              src="data:image/png;base64,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"
            />
          </CardTitle>
          <CardDescription className="text-neutral-300 text-base font-bold font-sans w-64 text-center flex">
            Sign up to see photos and videos from your friends.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col justify-between mt-14 h-2/4 ">
          <div className="flex flex-col justify-around h-3/4">
            <Input
              value={emailORPhoneInputValue}
              onChange={HandleEmailORPhoneValue}
              placeholder="Email or Phone Number"
              className="border-neutral-500 w-64 text-sm text-white"
            />
            {emailErr ? (
              <div className="text-red-500">{emailInvalid}</div>
            ) : null}
            <Input
              value={usernameInputValue}
              onChange={HandleUsernameValue}
              placeholder="Username"
              className="border-neutral-500 w-64 text-sm text-white"
            />
            {usernameErr ? (
              <div className="text-red-500">{usernameInvalid}</div>
            ) : null}
            <Input
              value={passInputValue}
              onChange={HandlePassValue}
              placeholder="Password"
              className="border-neutral-500 w-64 text-sm text-white"
            />
            {passErr ? <div className="text-red-500">{passInvalid}</div> : null}
            <Input
              value={bioValue}
              onChange={HandleBioValue}
              placeholder="Bio"
              className="border-neutral-500 w-64 text-sm text-white"
            />
            {bioERR ? <div className="text-red-500">{bioInvalid}</div> : null}
          </div>
          <Button
            className="bg-sky-600 w-64 h-8 font-extrabold"
            onClick={ClikedOnSubmit}
          >
            Sign up
          </Button>
        </CardContent>
        <CardFooter className="mt-14 flex justify-center">
          <span className="text-white font-semibold text-lg">
            Have an account?
          </span>
          <span
            className="text-sky-500 font-extrabold text-lg hover:underline"
            onClick={HandleLogiin}
          >
            {" "}
            Log in
          </span>
        </CardFooter>
      </Card>
    </div>
  );
};
export default SignUP;
