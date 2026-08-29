import { redirect } from "next/navigation";

export default function Home() {
  redirect("/issues");
}                                         // Trigger webhook test for CORE-102