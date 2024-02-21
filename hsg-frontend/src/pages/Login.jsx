import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthentication } from "../hooks/authentication";

function Login() {
  const navigate = useNavigate();
  const { authenticatedUser: user, login } = useAuthentication();

  const [statusMessage, setStatusMessage] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  function testAdminLogin() {
    setFormData({
      email: "email@server.tld",
      password: "password",
    });

    onLoginSubmit(new Event("submit"));
  }
  function testTrainerLogin() {
    setFormData({
      email: "chris@email.com",
      password: "password",
    });

    onLoginSubmit(new Event("submit"));
  }
  function testMemberLogin() {
    setFormData({
      email: "gym2@email.com",
      password: "password",
    });

    onLoginSubmit(new Event("submit"));
  }

  async function onLoginSubmit(e) {
    console.log("Logging in");
    e.preventDefault();
    setStatusMessage("Logging in...");

    if (
      !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)
    ) {
      setStatusMessage("Invalid email address");
      return;
    }

    try {
      const result = await login(formData.email, formData.password);
      console.log("Login result:", result);

      if (!result || !result.token) {
        console.error("Unexpected result object:", result);
        setStatusMessage("Login failed: Unexpected server response");
        return;
      }

      setStatusMessage("Login successful!");
      console.log("Status message set");

      console.log("Navigating...");

      navigate("/timetable");

      console.log("Navigation should have occurred");
    } catch (error) {
      console.error("Error during login:", error);
      setStatusMessage("Login failed: " + error.message);
    }
  }

  return (
    <section className="flex justify-center mt-20">
      <form className="" onSubmit={onLoginSubmit}>
        <h1
          className="text-center py-10 uppercase font-black	text-2xl
	text-green-600	"
        >
          Please Login
        </h1>
        <div className="">
          <label className="label">
            <span
              className="text-center uppercase font-black	text-lg
	 label-text"
            >
              Email
            </span>
          </label>
          <input
            type="email"
            placeholder="email@server.tld"
            className="input input-bordered w-full"
            value={formData.email}
            onChange={(e) =>
              setFormData((existing) => {
                return { ...existing, email: e.target.value };
              })
            }
          />
        </div>
        <div className="">
          <label className="label">
            <span
              className="text-center uppercase font-black	text-lg
	 label-text"
            >
              Password
            </span>
          </label>
          <input
            type="password"
            placeholder="password"
            className="input input-bordered w-full"
            value={formData.password}
            onChange={(e) =>
              setFormData((existing) => {
                return { ...existing, password: e.target.value };
              })
            }
          />
        </div>
        <div className="flex flex-col">
          <button type="submit" className="btn btn-primary btn-wide mt-10">
            login
          </button>

          <button
            className="btn bg-red-600 btn-prima btn-wide mt-10"
            onClick={testAdminLogin}
          >
            Login as Admin
          </button>
          <button
            className="btn bg-green-600 btn-prima btn-wide mt-10"
            onClick={testTrainerLogin}
          >
            Login as Trainer
          </button>
          <button
            className="btn bg-blue-600 btn-prima btn-wide mt-10"
            onClick={testMemberLogin}
          >
            Login as Member
          </button>
        </div>

        <p className="label-text-alt">{statusMessage}</p>
      </form>
    </section>
  );
}
export default Login;
