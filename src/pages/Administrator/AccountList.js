import Table from "components/Table";
import Wrapper from "components/Wrapper";
import React from "react";

const AccountList = () => {
    const columns = ["ID", "Full name", "Email", "Created Day"];
    const data = [
        {
            id: 1,
            fullname: "Ho Kha Minh",
            email: "hokhaminh@gmail.com",
            createdDay: "31/3/2021",
        },
        {
            id: 1,
            fullname: "Ho Kha Minh",
            email: "hokhaminh@gmail.com",
            createdDay: "31/3/2021",
        },
        {
            id: 1,
            fullname: "Ho Kha Minh",
            email: "hokhaminh@gmail.com",
            createdDay: "31/3/2021",
        },
        {
            id: 1,
            fullname: "Ho Kha Minh",
            email: "hokhaminh@gmail.com",
            createdDay: "31/3/2021",
        },
        {
            id: 1,
            fullname: "Ho Kha Minh",
            email: "hokhaminh@gmail.com",
            createdDay: "31/3/2021",
        },
        {
            id: 1,
            fullname: "Ho Kha Minh",
            email: "hokhaminh@gmail.com",
            createdDay: "31/3/2021",
        },
        {
            id: 1,
            fullname: "Ho Kha Minh",
            email: "hokhaminh@gmail.com",
            createdDay: "31/3/2021",
        },
    ];
    return (
        <Wrapper className="d-flex flex-column">
            <Table columns={columns} data={data} />
        </Wrapper>
    );
};

export default AccountList;
