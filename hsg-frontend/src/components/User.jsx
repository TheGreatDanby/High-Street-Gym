import React from "react";

function User() {
  return (
    <div className="w-auto ">
      <div>
        <form action="#"> </form>
        <label
          for="first-name"
          className="text-sm font-medium text-white-900 block mb-2"
        >
          First Name goes here
        </label>
        <input
          type="text"
          name="first-name"
          id="first-name"
          className="shadow-sm bg-gray-50 border border-gray-300 text-white-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
          placeholder="Arnold"
          required
        />
      </div>
      <div className="col-span-6 sm:col-span-3">
        <label
          for="last-name"
          className="text-sm font-medium text-white-900 block mb-2"
        >
          Last Name
        </label>
        <input
          type="text"
          name="last-name"
          id="last-name"
          className="shadow-sm bg-gray-50 border border-gray-300 text-white-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
          placeholder="Schwarzenegger"
          required
        />
      </div>
      <div className="col-span-6 sm:col-span-3">
        <label
          for="email"
          className="text-sm font-medium text-white-900 block mb-2"
        >
          Email
        </label>
        <input
          type="email"
          name="email"
          id="email"
          className="shadow-sm bg-gray-50 border border-gray-300 text-white-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
          placeholder="example@company.com"
          required
        />
      </div>
      <div className="col-span-6 sm:col-span-3">
        <label
          for="department"
          className="text-sm font-medium text-white-900 block mb-2"
        >
          Role
        </label>
        <select className="select shadow-sm bg-gray-50 border border-gray-300 text-white-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5">
          <option disabled selected>
            Select the Users Role
          </option>
          <option>Member</option>
          <option>Trainer</option>
          <option>Admin</option>
        </select>
      </div>
      <div className="col-span-6 sm:col-span-3">
        <label
          for="new-password"
          className="text-sm font-medium text-white-900 block mb-2"
        >
          New Password
        </label>
        <input
          type="password"
          name="new-password"
          id="new-password"
          className="shadow-sm bg-gray-50 border border-gray-300 text-white-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5 mb-5"
          placeholder="••••••••"
          required
        />
      </div>
      <button className="btn btn-block rounded-lg btn-success mb-5">
        Save
      </button>
      <button className="btn btn-block rounded-lg btn-error ">Cancel</button>
    </div>
  );
}

export default User;
