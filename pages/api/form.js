import axios from "axios";


const jira = {
  url: "https://jira.admin.virginia.edu",
  headers: {
     Authorization: "Bearer " + process.env.JIRA_API_KEY,
     "X-ExperimentalApi": "opt-in",
  },
  issueTypeId: "10700",
};
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
      `${jira.url}/rest/api/2/user/search?username=${person.email}`,
      {
        headers: jira.headers
      }
    );
    const user = response.data.find((u) => u.emailAddress === person.email);
    if (user) {
      return user.name;
    } else {
      // Create a new user with the given email
      const bodyData = {
        email: person.email,
        fullName: person.name,
      };
      const response = await axios.post(
        `${jira.url}/rest/servicedeskapi/customer`,
        bodyData,
        {
          headers: jira.headers,
        }
      );
      return response.data.name;
    }
  } catch (error) {
    console.log(error);
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
        name: customerId,
      },
      issuetype: {
        id: jira.issueTypeId,
      },
      description: body.comments,
      ...(body.staff[0].value ? { assignee: { name: body.staff[0].value } } : {}),
      customfield_13184: { value: body.requestType },
      customfield_10972: "Office Hours Request",
      //customfield_10255: body.repID,
      customfield_13076: ldapRes.data.data[0].department,
      customfield_13096: ldapRes.data.data[0].school,
      customfield_13175: body.date,
      customfield_13190: body.discipline,
      customfield_13194: mappedDetails,
      customfield_13203: { value: body.meetingType },
      ...(body.computePlatform1 !== "none"
        ? {
            customfield_13189: {
              value: body.computePlatform1,
              child: {
                value: body.computePlatform2,
              },
            },
          }
        : {}),
      ...(body.storagePlatform1 !== "none"
        ? {
            customfield_13195: {
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
    url: `${jira.url}/rest/api/2/issue`,
    headers: jira.headers,
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
            `${jira.url}/rest/servicedeskapi/request/` +
            jiraRes.data.key +
            "/participant",
          data: {
            // Provide data for updating the ticket in the Service Desk API
            usernames: staffIds,
          },
          headers: jira.headers,
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
    console.log(err)
    res.status(500).json({ data: "Error" });
  }
  //   } else {
  //     res.status(500).json({ data: "Error" });
  //   }
}
