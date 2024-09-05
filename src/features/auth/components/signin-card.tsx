import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";

const SigninCard = ({ changeState }: { changeState: () => void }) => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const { signIn } = useAuthActions();

  const serviceSigninHandler = (value: "github" | "google") => {
    signIn(value);
  };

  return (
    <Card className="w-full h-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Login to continue</CardTitle>
        <CardDescription>
          Use your email or another service to continue
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 px-0 pb-0">
        <form className="space-y-2.5">
          <Input
            disabled={false}
            value={email}
            onChange={({ target: { value } }) => setemail(value)}
            placeholder="Email"
            type="email"
            required
          />
          <Input
            disabled={false}
            value={password}
            onChange={({ target: { value } }) => setpassword(value)}
            placeholder="Password"
            type={"password"}
            required
          />
          <Button type="submit" className="w-full" size="lg" disabled={false}>
            Continue
          </Button>
        </form>
        <Separator />
        <div className="flex flex-col gap-y-2.5">
          <Button
            className="w-full relative"
            size="lg"
            disabled={true}
            onClick={serviceSigninHandler.bind(null, "google")}
            variant="outline">
            <FcGoogle className="size-5 absolute left-4" />
            Continue with Google
          </Button>
          <Button
            className="w-full relative"
            size="lg"
            // disabled={false}
            onClick={serviceSigninHandler.bind(null, "github")}
            variant="outline">
            <FaGithub className="size-5 absolute left-4" />
            Continue with Github
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Dont't have an account?{" "}
          <span
            onClick={changeState}
            className="text-sky-700 hover:underline cursor-pointer">
            Sign up
          </span>
        </p>
      </CardContent>
    </Card>
  );
};

export default SigninCard;
