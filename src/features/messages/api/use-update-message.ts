import { useMutation } from "convex/react";
import { useCallback, useMemo, useState } from "react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

type RequestType = {
  body: string;
  id: Id<"messages">;
};
type ResponseType = Id<"messages"> | null;

type Options = {
  onSuccess?: (data: ResponseType) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
};

export const useUpdateMessage = () => {
  const [data, setdata] = useState<ResponseType>(null);
  const [error, seterror] = useState<Error | null>(null);
  const [status, setstatus] = useState<
    "success" | "error" | "settled" | "pending" | null
  >(null);

  const isPending = useMemo(() => status === "pending", [status]);
  const isSuccess = useMemo(() => status === "success", [status]);
  const isError = useMemo(() => status === "error", [status]);
  const isSettled = useMemo(() => status === "settled", [status]);

  const mutation = useMutation(api.messages.update);

  const mutate = useCallback(
    async (values: RequestType, options?: Options) => {
      try {
        setdata(null);
        seterror(null);
        setstatus("pending");

        const response = await mutation(values);
        options?.onSuccess?.(response);
        setstatus("success");
        setdata(response);
      } catch (error: any) {
        options?.onError?.(error);
        setstatus("error");
        seterror(error);
      } finally {
        setstatus("settled");
        options?.onSettled?.();
      }
    },
    [mutation]
  );

  return { mutate, data, error, isPending, isSuccess, isError, isSettled };
};
