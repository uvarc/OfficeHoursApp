import axios from "axios";

const config = {
  headers: {
    Authorization: process.env.LDAP_API_KEY,
  },
};

//setup config for jira

const JiraUser = async (person) => {
  try {
    // Check if the user already exists in Jira
    const response = await axios.get(
      `https://varesearchhelp.atlassian.net/rest/api/3/user/search?query=${person.email}`,
      {
        headers: {
          Authorization: "Basic " + process.env.JIRA_API_KEY,
        },
      }
    );
    const user = response.data.find((u) => u.emailAddress === person.email);
    if (user) {
      return user.accountId;
    } else {
      // Create a new user with the given email
      const bodyData = {
        email: person.email,
        displayName: person.name,
      };
      const response = await axios.post(
        "https://varesearchhelp.atlassian.net/rest/servicedeskapi/customer",
        bodyData,
        {
          headers: {
            Authorization: "Basic " + process.env.JIRA_API_KEY,
          },
        }
      );
      return response.data.accountId;
    }
  } catch (error) {
    return undefined;
  }
};

export default async function handler(req, res) {
  // Get data submitted in request's body.
  const body = req.body;

  const config = {
    headers: {
      Authorization: process.env.LDAP_API_KEY,
    },
  };
  const ldapRes = await axios.get(
    "https://ldap-api.pods.uvarc.io/api/multiuser?userID=" + body.userID,
    config
  );
  const mappedDetails = body.details.map((item) => {
    return { value: item.value };
  });

  var jiraUsername = body.userID;
  if (ldapRes.data.data[0].displayName === "NA") {
    jiraUsername = body.userID;
  } else {
    // Split the name into parts using comma and whitespace
    const nameParts = ldapRes.data.data[0].displayName.split(", ");

    // Extract the first name
    const firstName = nameParts[1].split(" ")[0];

    // Extract the last name
    const lastName = nameParts[0];

    // Construct the new name in "first name last name" format
    jiraUsername = `${firstName} ${lastName}`;
  }
  const customerData = {
    name: jiraUsername,
    email: body.userID + "@virginia.edu",
  };

  const customerId = await JiraUser(customerData);
  //send to jira
  const jiraData = {
    fields: {
      project: {
        key: "OH",
      },
      reporter: {
        id: customerId,
      },
      issuetype: {
        id: "10007",
      },
      description: {
        type: "doc",
        version: 1,
        content: [
          {
            type: "paragraph",
            content: [
              {
                text: body.comments,
                type: "text",
              },
            ],
          },
        ],
      },
      ...(body.staff[0].value ? { assignee: { id: body.staff[0].value } } : {}),
      customfield_10261: { value: body.requestType },
      customfield_10001: "578",
      customfield_10255: body.repID,
      customfield_10241: ldapRes.data.data[0].department,
      customfield_10242: ldapRes.data.data[0].school,
      customfield_10256: body.date,
      customfield_10281: body.discipline,
      customfield_10280: mappedDetails,
      customfield_10282: { value: body.meetingType },
      ...(body.computePlatform1 !== "none"
        ? {
            customfield_10278: {
              value: body.computePlatform1,
              child: {
                value: body.computePlatform2,
              },
            },
          }
        : {}),
      ...(body.storagePlatform1 !== "none"
        ? {
            customfield_10279: {
              value: body.storagePlatform1,
              child: {
                value: body.storagePlatform2,
              },
            },
          }
        : {}),
      summary: body.summary,
    },
  };
  const config2 = {
    method: "post",
    url: "https://varesearchhelp.atlassian.net/rest/api/3/issue",
    headers: {
      Authorization: "Basic " + process.env.JIRA_API_KEY,
    },
    data: jiraData,
  };

  //send to jira
  try {
    const jiraRes = await axios(config2);
    // If ticket is created, make PUT call to Service Desk API
    if (jiraRes.status === 201) {
      const staffIds = body.staff.slice(1).map((obj) => obj.value);
      if (staffIds.length > 0) {
        const servicedeskConfig = {
          method: "POST",
          url:
            "https://varesearchhelp.atlassian.net/rest/servicedeskapi/request/" +
            jiraRes.data.key +
            "/participant",
          data: {
            // Provide data for updating the ticket in the Service Desk API
            accountIds: staffIds,
          },
          headers: {
            Authorization: "Basic " + process.env.JIRA_API_KEY,
          },
        };
        const servicedeskRes = await axios(servicedeskConfig);
        res.status(200).json({ data: jiraRes.data });
      } else {
        res.status(200).json({ data: jiraRes.data });
      }
    } else {
      res.status(500).json({ data: "Error" });
    }
    // Sends a HTTP success code
  } catch (err) {
    res.status(500).json({ data: "Error" });
  }
  //   } else {
  //     res.status(500).json({ data: "Error" });
  //   }
}
