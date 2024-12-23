import React, { useContext, useEffect, useState } from "react";
import CarPackageView from "../components/CarPackageView.jsx";
import axios from "axios";
import { LoginContext } from "../context/LoginContext.jsx";
import { io } from "socket.io-client";
import Cookies from "js-cookie";
const CarWashDashboardView = () => {
  const [loading, setLoading] = useState(false);
  const [receivedCar, setReceivedCar] = useState(false);
  const session_id = Cookies.get("rush_session_id");
  const [car_number, setCarNumber] = useState("");
  const [packages, setPackages] = useState([]);
  const [error, setError] = useState(false);

  const searchForPackages = async (e) => {
    if (e) {
      e.preventDefault();
    }
    setReceivedCar(false)
    setLoading(true);
    setError(false);

    try {
      // Simulating an API call here
      console.log(car_number, session_id);

      const fetchedPackages = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/get/car/packages`,
        { car_number: car_number, session_id: session_id }
      ); // Replace with actual API call
      setPackages(Object.values(fetchedPackages.data.result));
      // setPackages(fetchedPackages.data.result);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Connect to the Flask WebSocket server
    const socket = io(`${import.meta.env.VITE_BASE_URL}`); // Adjust the URL if your Flask app is hosted elsewhere
    // Listen for the 'server_message' event from Flask
    socket.on("server_message", (data) => {
      console.log(data);
      setCarNumber(data.data);
      setReceivedCar(true);
    });

    // Clean up on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);
  useEffect(() => {
    if (receivedCar === true) {
      searchForPackages();
    }
  }, [receivedCar]);
  return (
    <div className="o_action">
      <section className="package_subscription px-2 px-m-0">
        {/* Search Bar */}
        <form
          onSubmit={searchForPackages}
          className="align-items-center container d-flex flex-row gap-2 justify-content-center p-0"
        >
          <div className="col-md-11 col-sm-10 flex-grow-1 m-0 s_webscol-9 s_website_form_field s_website_form_model_required">
            <div className="row s_col_no_resize s_col_no_bgcolor">
              <div className="col-sm position-relative">
                <input
                  className="form-control s_website_form_input"
                  type="text"
                  name="car_number"
                  required
                  placeholder="رقم السيارة"
                  value={car_number}
                  onChange={(e) => setCarNumber(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="mb-0 s_website_form_submit custom-btn w-fit btn-red btn-red">
            <button
              type="submit"
              className="s_website_form_send o_default_snippet_text"
            >
              بحث
            </button>
            <span id="s_website_form_result" />
          </div>
        </form>

        {/* Packages Container */}
        <div className="packages-container px-md-2">
          <div className="container">
            {loading && (
              <div className="loading d-flex flex-column justify-content-center align-items-center gap-2">
                <span className="loader"></span>
                <div className="loading-text text-center">جاري التحميل...</div>
              </div>
            )}

            {!loading && !packages.length && !error && (
              <h1 className="no-packages">لا يوجد باقات للعرض</h1>
            )}

            {!loading && packages.length > 0 && !error && (
              <div className="package-items-container">
                {packages.map((packageItem) => (
                  <CarPackageView
                    key={packageItem.line_id}
                    packageItem={packageItem}
                  />
                ))}
              </div>
            )}

            {error && (
              <div className="loading-text error-text text-center">
                حدث خطأ أثناء جلب البيانات, الرجاء المحاولة مرة أخرى!
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CarWashDashboardView;
