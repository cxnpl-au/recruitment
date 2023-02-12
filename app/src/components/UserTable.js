import React from "react";

export default function UserTable(props) {
  const buildTable = () => {
    props.users?.map((user) => {
      return (
        <tr class="bg-white border-b">
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
            {user._id}
          </td>
          <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
            {user.name}
          </td>
          <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
            {user.email}
          </td>
          <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
            {user.role}
          </td>
        </tr>
      );
    });
  };

  return (
    <div class="flex flex-col">
      <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="py-4 inline-block min-w-full sm:px-6 lg:px-8">
          <div class="overflow-hidden">
            <table class="min-w-full text-center">
              <thead class="border-b bg-gray-800">
                <tr>
                  <th
                    scope="col"
                    class="text-sm font-medium text-white px-6 py-4"
                  >
                    #
                  </th>
                  <th
                    scope="col"
                    class="text-sm font-medium text-white px-6 py-4"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    class="text-sm font-medium text-white px-6 py-4"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    class="text-sm font-medium text-white px-6 py-4"
                  >
                    Role
                  </th>
                </tr>
              </thead>
              <tbody>{buildTable}</tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
