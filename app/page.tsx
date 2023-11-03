"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect } from "react";

const tokenApiUrl = "https://lucidapismvp.azurewebsites.net/api/token";
const requestBody = {
  client_id: "53832cbc-f252-4de7-991b-4ed8965e1bad",
  resource: "api://9e1a4304-8c3c-47cb-8ebb-0960b8203615",
  grant_type: "client_credentials",
  client_secret: "NjH8Q~7-Q8-FapmCc_QoUuUAfixN6OUYW.52laRl",
};
const baseApiUrl = "https://lucidapismvp.azurewebsites.net/api/DataPods/Get";
const accountId = "067B78ED-825E-493F-A9D0-F0A13512AF15";
const recordsPerPage = 100;
const pageNumber = 1;

async function fetchData() {
  const authResponse: any = fetch(
    "https://lucidapismvp.azurewebsites.net/api/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    }
  );
  console.log("res", authResponse.access_token);
  // const headers = {
  //   Authorization: `Bearer ${accessToken}`,
  //   'Content-Type': 'application/json',
  // };
  //   const response = await fetch(url, {
  //     method: 'GET',
  //     headers: headers,
  //   });
  //   const data = await response.json();
  //   console.log("data", data)
}

const Home = () => {
  const categories = [
    { label: "Business", value: "business" },
    { label: "Entertainment", value: "entertainment" },
    { label: "Health", value: "health" },
    { label: "Sports", value: "sports" },
    { label: "Technology", value: "technology" },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex justify-between">
      {categories?.map(({ label, value }) => (
        <Link href={`/${value}`} key={value}>
          <Button>{label}</Button>
        </Link>
      ))}
    </div>
  );
};

export default Home;
