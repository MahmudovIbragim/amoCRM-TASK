/* eslint-disable @typescript-eslint/no-explicit-any */
import "./app.scss";
import  { useEffect, useState } from "react";
import { fetchAccessToken, redirectToAuthPage } from "./service/api";
import { fetchLeadsWithRateLimit, getLeadDetails } from "./service/script";

const App = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingLeadId, setLoadingLeadId] = useState<number | null>(null); 
  const [expandedLead, setExpandedLead] = useState<any | null>(null); 

  useEffect(() => {
    const response = localStorage.getItem("response");
    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get("code");

    const fetchData = async () => {
      setLoading(true);

      if (!authCode) {
        redirectToAuthPage();
      } else {
        if (response === null || response === undefined) {
          await fetchAccessToken();
        } else {
          const data = await fetchLeadsWithRateLimit();
          setLeads(data || []);
        }
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  const handleCardClick = async (leadId: number) => {
    if (loadingLeadId === leadId) {
      return;
    }

    setLoadingLeadId(leadId);
    setExpandedLead(null);

    const details = await getLeadDetails(leadId);
    setLoadingLeadId(null); 
    setExpandedLead(details); 
  };

  return (
    <div className="App">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Budget</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <>
                    <tr onClick={() => handleCardClick(lead.id)} key={lead.id}>
                      <td>{lead.id}</td>
                      <td>{lead.name}</td>
                      <td>{lead.price}</td>
                    </tr>
                    {expandedLead && expandedLead.id === lead.id && (
                      <tr>
                        <td colSpan={3}>
                          {loadingLeadId === lead.id ? (
                            <p>Loading...</p>
                          ) : (
                            <div className="content">
                              <h4>Details</h4>
                              <p>Name: {expandedLead.name}</p>
                              <p>ID: {expandedLead.id}</p>
                              <p>
                                Date:{" "}
                                {new Date(
                                  expandedLead.created_at * 1000
                                ).toLocaleDateString()}
                              </p>
                              <p>
                                Status:
                                <span
                                  style={{
                                    display: "inline-block",
                                    width: 20,
                                    height: 20,
                                    borderRadius: "50%",
                                    backgroundColor:
                                      expandedLead.closest_task_at === null ||
                                      new Date(
                                        expandedLead.closest_task_at * 1000
                                      ) < new Date()
                                        ? "red"
                                        : new Date(
                                            expandedLead.closest_task_at * 1000
                                          ).toDateString() ===
                                          new Date().toDateString()
                                        ? "green"
                                        : "yellow",
                                  }}
                                />
                              </p>
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
