import { Inter } from "@next/font/google";
import styles from "./styles.module.css";
import { useRef, useState } from "react";
import { irbEndpointUrl } from "@/constants";

const inter = Inter({ subsets: ["latin"] });

export default function IRBPage() {
    const computingIdRef = useRef(null);
    const studyIdRef = useRef(null);
    const ivyProjectIdRef = useRef(null);

    const [computingIdDisabled, setComputingIdDisabled] = useState(false);
    const [studyIdDisabled, setStudyIdDisabled] = useState(false);
    const [ivyProjectIdDisabled, setIvyProjectIdDisabled] = useState(false);
    const [resultsData, setResultsData] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const computingId = computingIdRef.current.value;
        const studyId = studyIdRef.current.value;
        const ivyProjectId = ivyProjectIdRef.current.value;

        let cnt = 0;
        if (computingId) cnt += 1;
        if (studyId) cnt += 1;
        if (ivyProjectId) cnt += 1;

        if (cnt !== 1) {
            alert("Please provide exactly one identifier: Computing ID, Study ID, or Ivy Project ID.");
            return;
        }

        if (computingId) {
            console.log("Fetching IRB info for Computing ID:", computingId);
            const response = await fetch(`${irbEndpointUrl}/user?${new URLSearchParams({ computingId })}`)
            const data = await response.json();
            setResultsData(data);
        } else if (studyId) {
            console.log("Fetching IRB info for Study ID:", studyId);
            const response = await fetch(`${irbEndpointUrl}/study?${new URLSearchParams({ studyId })}`)
            const data = await response.json();
            setResultsData(data);
        } else if (ivyProjectId) {
            console.log("Fetching IRB info for Ivy Project ID:", ivyProjectId);
            const response = await fetch(`${irbEndpointUrl}/ivy_project?${new URLSearchParams({ ivyProjectId })}`)
            const data = await response.json();
            setResultsData(data);
        }
    };

    // Disable other text inputs when one is filled
    const handleInputChange = () => {
        const computingId = computingIdRef.current.value;
        const studyId = studyIdRef.current.value;
        const ivyProjectId = ivyProjectIdRef.current.value;

        if (computingId) {
            setStudyIdDisabled(true);
            setIvyProjectIdDisabled(true);
        } else if (studyId) {
            setComputingIdDisabled(true);
            setIvyProjectIdDisabled(true);
        } else if (ivyProjectId) {
            setComputingIdDisabled(true);
            setStudyIdDisabled(true);
        } else {
            setComputingIdDisabled(false);
            setStudyIdDisabled(false);
            setIvyProjectIdDisabled(false);
        }
    }

    const results = resultsData && (
        <div className={styles.results}>
            <h2>Results:</h2>
            <pre>{JSON.stringify(resultsData, null, 2)}</pre>
        </div>
    );

    return (
        <div className={styles.body}>
            <div className={styles.container}>
                <main className={inter.className}>
                    <h1>IRB Information</h1>
                    <p>Welcome to the IRB information page.</p>

                    <form className={styles.form} onSubmit={handleSubmit}>
                        <div className={styles.row}>
                            <div className={styles.col}>
                                <label htmlFor="computing-id">Computing ID</label>
                                <input type="text" id="computing-id" name="computing-id" ref={computingIdRef} disabled={computingIdDisabled} onChange={handleInputChange} />
                            </div>

                            <div className={styles.col}>
                                <label htmlFor="study-id">Study ID</label>
                                <input type="text" id="study-id" name="study-id" ref={studyIdRef} disabled={studyIdDisabled} onChange={handleInputChange} />
                            </div>

                            <div className={styles.col}>
                                <label htmlFor="ivy-project-id">Ivy Project ID</label>
                                <input type="text" id="ivy-project-id" name="ivy-project-id" ref={ivyProjectIdRef} disabled={ivyProjectIdDisabled} onChange={handleInputChange} />
                            </div>
                        </div>

                        <hr />

                        <button type="submit" className={styles.submitButton}>Submit</button>

                        <hr />

                        {results ?? (<p>No results to display.</p>)}
                    </form>
                </main>
            </div>
        </div>
    );
}
