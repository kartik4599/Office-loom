import { useMutation } from "convex/react";
import { useCallback, useMemo, useState } from "react";
import { api } from "../../../../convex/_generated/api";

type ResponseType = string | null;

type Options = {
  onSuccess?: (data: ResponseType) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
  throwError?: boolean;
};

export const useGenerateUpload = () => {
  const [data, setdata] = useState<ResponseType>(null);
  const [error, seterror] = useState<Error | null>(null);
  const [status, setstatus] = useState<
    "success" | "error" | "settled" | "pending" | null
  >(null);

  const isPending = useMemo(() => status === "pending", [status]);
  const isSuccess = useMemo(() => status === "success", [status]);
  const isError = useMemo(() => status === "error", [status]);
  const isSettled = useMemo(() => status === "settled", [status]);

  const mutation = useMutation(api.storage.generateUploadUrl);

  const mutate = useCallback(
    async (values: {}, options?: Options) => {
      try {
        setdata(null);
        seterror(null);
        setstatus("pending");

        const response = await mutation(values);
        options?.onSuccess?.(response);
        setstatus("success");
        setdata(response);
        return response;
      } catch (error: any) {
        options?.onError?.(error);
        setstatus("error");
        seterror(error);
        if (options?.throwError) throw new Error(error);
      } finally {
        setstatus("settled");
        options?.onSettled?.();
      }
    },
    [mutation]
  );

  return { mutate, data, error, isPending, isSuccess, isError, isSettled };
};
