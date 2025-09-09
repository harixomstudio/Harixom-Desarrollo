import { createFileRoute } from "@tanstack/react-router";
import RegisterAdminPage from "../components/pages/RegisterAdminPage";

export const Route = createFileRoute("/RegisterAdmin")({
  component: RegisterRoute,
});

function RegisterRoute() {
  return (
    <RegisterAdminPage
      title="New User"
      name="Name"
      email="Email"
      phone="Phone"
      address="Address"
      password="Password"
      confirmPassword="Confirm Password"
      link="Back"
    />
  );
}
