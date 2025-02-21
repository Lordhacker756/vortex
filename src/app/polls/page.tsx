"use client";
import axiosInstance from "@/lib/axios";
import React, { useEffect } from "react";

const page = () => {
  useEffect(() => {
    (async () => {
      const res = await axiosInstance.get(
        "/polls/cbe92bba-e2dc-4de3-b4e3-84d8dfa234c1"
      );
      console.log(res.data);
    })();
  }, []);
  return <div>All Polls</div>;
};

export default page;
