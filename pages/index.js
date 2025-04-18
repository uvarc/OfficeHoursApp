import Head from "next/head";
import { Inter } from "@next/font/google";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Container, Card } from "react-bootstrap";
import { useState } from "react";
import Spinner from "react-bootstrap/Spinner";
import { Alert } from "react-bootstrap";
import CascadingDropdownStorage from "./components/CascadingDropdownStorage";
import CascadingDropdownCompute from "./components/CascadingDropdownCompute";
import Select from "react-select";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [ticket, setTicket] = useState("");
  const [completed, setCompleted] = useState(false);
  const [errorMesg, setErrorMesg] = useState("");
  const [details, setDetails] = useState([]);
  const [staff, setStaff] = useState([]);

  const rcStaff = [
    { value: "jus2yw", label: "Ahmad Sheikhzada" },
    { value: "aab5zd", label: "Angela Boakye" },
    { value: "kjl5t", label: "Kathryn Linehan" },
    { value: "gpd6kn", label: "Priyanka Prakash" },
    { value: "teh1m", label: "Ed Hall" },
    { value: "gka6a", label: "Gladys Andino" },
    { value: "jmh5ad", label: "Jackie Huband" },
    { value: "khs3z", label: "Karsten Siller" },
    { value: "kah3f", label: "Katherine Holcomb" },
    { value: "mb5wt", label: "Marcus Bobar" },
    { value: "egg3xa", label: "Paul Orndorff" },
    { value: "rs7wz", label: "Ruoshi Sun" },
    { value: "cmd7ag", label: "Camden Duy" },
    { value: "xve5kj", label: "Hana Parece" },
  ];

  const detailOptions = [
    "System: Outage",
    "System: Performance",
    "Access: Allocation/account",
    "Access: VPN",
    "Access: SSH",
    "Access: MobaXterm",
    "Access: FastX",
    "Access: OOD",
    "Access: other",
    "OOD: JupyterLab",
    "OOD: RStudio",
    "OOD: Matlab",
    "OOD: Desktop",
    "OOD: other",
    "File Transfer: Globus",
    "File Transfer: DTN",
    "File Transfer: CLI tools",
    "File Transfer: other",
    "HW: Standard",
    "HW: Parallel",
    "HW: Largemem",
    "HW: GPU",
    "HW: Condo",
    "HW: DB host",
    "HW: other",
    "Language: C/C++",
    "Language: Fortran",
    "Language: Python",
    "Language: R",
    "Language: Matlab",
    "Language: Bash",
    "Language: other",
    "Domain: General HPC/Slurm",
    "Domain: HPC Optimization & Parallelization",
    "Domain: Software Installs/Containers",
    "Domain: Software Development",
    "Domain: Databases",
    "Domain: AI/ML/DL",
    "Domain: Data Science/Data Analytics",
    "Domain: Bioinformatics",
    "Domain: Image Processing",
    "Domain: Computational Chemistry",
    "Domain: Text Analysis",
    "Domain: Physics",
    "Documentation (answer not yet in documentation)",
  ];

  const detailOptionsWithLabel = detailOptions.map((option) => {
    return { value: option, label: option };
  });

  const handleSubmit = async (event) => {
    setSubmitting(true);
    // Stop the form from submitting and refreshing the page.
    event.preventDefault();
    var Storage1 = "";
    var Storage2 = "";
    var Compute1 = "";
    var Compute2 = "";
    // Get data from the form.
    if (
      event.target.formDropDownStorage !== undefined &&
      event.target.formDropDownStorage.value
    ) {
      Storage1 = event.target.formDropDownStorage.value;
      Storage2 = event.target.formDropDownStorage2.value;
      // ...rest of your code that uses dropdownValue
    } else {
      // handle the case where formDropDownStorage or its value is undefined
      Storage1 = "none";
      Storage2 = "none";
    }

    if (
      event.target.formDropDownCompute !== undefined &&
      event.target.formDropDownCompute.value
    ) {
      Compute1 = event.target.formDropDownCompute.value;
      Compute2 = event.target.formDropDownCompute2.value;
    } else {
      Compute1 = "none";
      Compute2 = "none";
    }

    const data = {
      userID: event.target.formID.value,
      staff: staff,
      meetingType: event.target.formDropDownMeeting.value,
      comments: event.target.formComments.value,
      summary: event.target.formSummary.value,
      date: event.target.formDate.value,
      details: details,
      storagePlatform1: Storage1,
      storagePlatform2: Storage2,
      computePlatform1: Compute1,
      computePlatform2: Compute2,
      discipline: event.target.formDropDownDiscipline.value,
      requestType: event.target.formDropDownRequestType.value,
    };

    // Send the data to the server in JSON format.
    const JSONdata = JSON.stringify(data);

    console.log("Started Request");

    // API endpoint where we send form data.
    // const endpoint = "/api/form";

    // Redirects to current LDAP endpoint
    // const endpoint = "http://localhost:5000/uvarc/api/ticket/officehours/create_ticket"
    const endpoint = "https://uvarc-unified-service.pods.uvarc.io/uvarc/api/ticket/officehours/create_ticket"

    // Form the request for sending data to the server.
    const options = {
      // The method is POST because we are sending data.
      method: "POST",
      // Tell the server we're sending JSON.
      headers: {
        "Content-Type": "application/json",
      },
      // Body of the request is the JSON data we created above.
      body: JSONdata,
    };
    // Send the form data to our forms API on Vercel and get a response.
    const response = await fetch(endpoint, options);
    // Get the response data from server as JSON.
    // If server returns the name submitted, that means the form works.
    if (response.status === 200) {
      const result = await response.json();
      setSubmitting(false);
      setCompleted(true);
      setSuccess(true);
      setTicket(
        "https://jira.admin.virginia.edu/browse/" +
          result.data.issueKey
      );
    } else {
      setSubmitting(false);
      setCompleted(true);
      setError(true);
      setErrorMesg(response.statusText);
    }
  };

  return (
    <>
      <Head>
        <title>User Meetings</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
        <div className="col-6 mx-auto">
          <Card className="shadow border">
            <Card.Header>
              <h1>User Meetings</h1>
            </Card.Header>
            <Card.Body>
              {!completed ? (
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="formID">
                    <Form.Label>Visitor ID</Form.Label>
                    <Form.Control
                      type="input"
                      placeholder="e.g. nje2n"
                      required
                    />
                  </Form.Group>
                  <Form.Group
                    className="mb-3"
                    controlId="formDropDownDiscipline"
                  >
                    <Form.Label>Discipline</Form.Label>
                    <Form.Select aria-label="Discipline">
                      <option value="">Select Option</option>
                      <option value="Astronomy">Astronomy</option>
                      <option value="Biochemistry">Biochemistry</option>
                      <option value="Bioinformatics">Bioinformatics</option>
                      <option value="Biology">Biology</option>
                      <option value="Business">Business</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Commerce">Commerce</option>
                      <option value="Computer Science">Computer Science</option>
                      <option value="Data Science">Data Science</option>
                      <option value="Economics">Economics</option>
                      <option value="Education">Education</option>
                      <option value="Environmental Science">
                        Environmental Science
                      </option>
                      <option value="Engineering">Engineering</option>
                      <option value="Health Sciences">Health Sciences</option>
                      <option value="Informatics">Informatics</option>
                      <option value="Law">Law</option>
                      <option value="Physics">Physics</option>
                      <option value="Social Sciences">Social Sciences</option>

                      <option value="Other">Other</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formRep">
                    <Form.Label>RC Representative(s)</Form.Label>
                    <Select
                      isMulti
                      name="formDropDownStaff"
                      options={rcStaff}
                      className="basic-multi-select"
                      classNamePrefix="select"
                      onChange={(option) => setStaff(option)}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formDate">
                    <Form.Label>Meeting Date</Form.Label>
                    <Form.Control type="date" required />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formDropDownMeeting">
                    <Form.Label>Meeting Type</Form.Label>
                    <Form.Select aria-label="Meeting">
                      <option value="Office Hours (walk-in)">Office Hours (walk-in)</option>
                      <option value="Consultation (scheduled)">Consultation (scheduled)</option>
                      <option value="Outreach Event (scheduled)">Outreach Event (scheduled)</option>
                      <option value="Training">Training</option>
                      <option value="Other">Other</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formSummary">
                    <Form.Label>Summary</Form.Label>
                    <Form.Control as="textarea" rows={1} required />
                  </Form.Group>                  
                  <Form.Group className="mb-3" controlId="formDropDownRequestType">
                    <Form.Label>Request Type</Form.Label>
                    <Form.Select aria-label="Request" required>
                      <option value="">Select Option</option>
                      <option value="Technical Support Tier 1">Technical Support Tier 1</option>
                      <option value="Technical Support Tier 2">Technical Support Tier 2</option>
                      <option value="Consulting Tier 1">Consulting Tier 1</option>
                      <option value="Consulting Tier 2">Consulting Tier 2</option>
                      <option value="Provisioning/Deprovisioning">Provisioning/Deprovisioning</option>
                      <option value="Education/Outreach">Education/Outreach</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formDropDownCompute">
                    <CascadingDropdownCompute />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formDropDownStorage">
                    <CascadingDropdownStorage />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formDropDownDetails">
                    <Form.Label>Details</Form.Label>

                    <Select
                      isMulti
                      name="formDropDownDetails"
                      options={detailOptionsWithLabel}
                      className="basic-multi-select"
                      classNamePrefix="select"
                      onChange={(option) => setDetails(option)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formComments">
                    <Form.Label>Comments</Form.Label>
                    <Form.Control as="textarea" rows={3} />
                  </Form.Group>
                  <Button variant="primary" type="submit" disabled={submitting}>
                    {submitting && <Spinner animation="border" size="sm" />}
                    Submit
                  </Button>
                </Form>
              ) : (
                <>
                  <Alert show={success} variant="success">
                    <Alert.Heading>Added To JIRA Successfully!</Alert.Heading>
                    <p>
                      Here is a reference to your issue:
                      <br />
                      <a href={ticket}>{ticket}</a>
                    </p>
                    <hr />
                    <div className="d-flex justify-content-end">
                      <Button
                        onClick={() => {
                          window.location.reload(true);
                        }}
                        variant="outline-success"
                      >
                        Close
                      </Button>
                    </div>
                  </Alert>
                  <Alert show={error} variant="danger">
                    <Alert.Heading>Issue Submission failed</Alert.Heading>
                    <p>
                      Error Message:
                      <br />
                      {...errorMesg}
                    </p>
                    <hr />
                    <div className="d-flex justify-content-end">
                      <Button
                        onClick={() => {
                          window.location.reload(true);
                        }}
                        variant="outline-success"
                      >
                        Close
                      </Button>
                    </div>
                  </Alert>
                </>
              )}
            </Card.Body>
          </Card>
        </div>
      </Container>
    </>
  );
}
