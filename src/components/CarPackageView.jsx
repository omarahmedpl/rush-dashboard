import axios from "axios";
import React, { useEffect } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const useFlipPackages = () => {
  useEffect(() => {
    const handleClick = (e) => {
      const packageItem = e.target.closest(".package-item");

      if (packageItem) {
        if (e.target.classList.contains("subscribe-button")) {
          return;
        }

        document.querySelectorAll(".package-item").forEach((otherItem) => {
          if (otherItem !== packageItem) {
            const otherCard = otherItem.querySelector(".card");
            if (otherCard) {
              otherCard.classList.remove("flipped");
              otherItem.classList.remove("show");
            }
          }
        });

        const card = packageItem.querySelector(".card");
        if (card) {
          card.classList.add("flipped");
          packageItem.classList.add("show");
        }
      } else if (
        !e.target.closest(".card") &&
        !e.target.closest(".subscribe-button")
      ) {
        document.querySelectorAll(".package-item").forEach((item) => {
          const card = item.querySelector(".card");
          if (card) {
            card.classList.remove("flipped");
            item.classList.remove("show");
          }
        });
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        document.querySelectorAll(".package-item").forEach((item) => {
          const card = item.querySelector(".card");
          if (card) {
            card.classList.remove("flipped");
            item.classList.remove("show");
          }
        });
      }
    };

    document.body.addEventListener("click", handleClick);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.removeEventListener("click", handleClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
};

const CarPackageView = ({ packageItem, startWashing }) => {
  const MySwal = withReactContent(Swal);

  useFlipPackages();
  const update_status = async (package_id, status = 0) => {
    let relay = {};
    relay[package_id.relay] = { relayStatus: status };
    let data = {
      slot: 0,
      io: {
        relay: relay,
      },
    };
    try {
      const { data: response } = await axios.put(
        `http://${package_id.ip_address}/api/slot/0/io/relay/${package_id.relay}/relayStatus`,
        { data },
        {
          headers: {
            Accept: "vdn.dac.v1", // Specify the Accept header here
          },
          timeout: 1000, // Timeout in milliseconds (e.g., 5 seconds)
        }
      );
    } catch (error) {
      throw new Error(error);
    }
  };
  const get_status = async (package_id) => {
    try {
      const { data } = await axios.get(
        `http://${package_id.ip_address}/api/slot/0/io/di`,
        {
          headers: {
            Accept: "vdn.dac.v1", // Specify the Accept header here
          },
          timeout: 1000, // Timeout in milliseconds (e.g., 5 seconds)
        }
      );
      // this.update_status(package_id)
      if (data["io"]) {
        if (data["io"]["di"]) {
          let di = data["io"]["di"];
          if (di[0][di] && di[0]["diStatus"]) {
            return di[0]["diStatus"];
          }
        }
      }
      return 0;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  };

  // const start_washing = async (package_id) => {
  //   // let available = await this.rpc("/web/dataset/call_kw", {
  //   //     model: "sale.order.line",
  //   //     method: "action_check_washing_numbers",
  //   //     args: [package_id.line_id], // Pass the license plate as the argument
  //   //     kwargs: {},
  //   // });
  //   let available = true;
  //   if (available) {
  //     let status = await get_status(package_id);
  //     console.log(status);
  //     try {
  //       if (!status) {
  //         await update_status(package_id, 0);
  //         await update_status(package_id, 1);
  //         let status = await get_status(package_id);
  //         if (status == 1) {
  //           MySwal.fire({
  //             title: "تم",
  //             text: "تم تشغيل الماكينة!",
  //             icon: "success",
  //             showCancelButton: false,
  //             confirmButtonText: "تم",
  //             cancelButtonText: "إلغاء",
  //           });
  //           await update_status(package_id, 0);
  //         }
  //       }
  //       //     await this.rpc("/web/dataset/call_kw", {
  //       //       model: "sale.order.line",
  //       //       method: "action_update_washing_numbers",
  //       //       args: [package_id.line_id], // Pass the license plate as the argument
  //       //       kwargs: {},
  //       //     });
  //       //   }
  //       // }
  //     } catch (err) {
  //       MySwal.fire({
  //         title: "يوجد مشكله",
  //         text: "يوجد مشكله في الاتصال مع الماكينة!",
  //         icon: "warning",
  //         showCancelButton: false,
  //         confirmButtonText: "تم",
  //         cancelButtonText: "إلغاء",
  //       });
  //     }
  //   } else {
  //     MySwal.fire({
  //       title: "تم",
  //       text: "تم الغسل من قبل!",
  //       icon: "warning",
  //       showCancelButton: false,
  //       confirmButtonText: "تم",
  //       cancelButtonText: "إلغاء",
  //     }).then((result) => {
  //       // if (result.isConfirmed) {
  //       //     Swal.fire("تم الحذف!", "تم حذف العنصر بنجاح.", "success");
  //       // }
  //     });
  //   }
  // };
  const start_washing = async (package_id) => {
    let errorOccurred = false; // Flag to track if an error occurred

    try {
      let available = true; // Simulating an available check
      if (available) {
        let status = await get_status(package_id); // Fetch the machine's current status
        console.log("Current Status:", status);

        if (!status) {
          await update_status(package_id, 0);
          await update_status(package_id, 1);

          let newStatus = await get_status(package_id);
          if (newStatus == 1) {
            MySwal.fire({
              title: "تم",
              text: "تم تشغيل الماكينة!",
              icon: "success",
              showCancelButton: false,
              confirmButtonText: "تم",
            });

            // Turn off the machine after success
            await update_status(package_id, 0);
          }
        }
      } else {
        MySwal.fire({
          title: "تم",
          text: "تم الغسل من قبل!",
          icon: "warning",
          showCancelButton: false,
          confirmButtonText: "تم",
        });
      }
    } catch (error) {
      // Handle all errors in one place and ensure the toast shows only once
      if (!errorOccurred) {
        errorOccurred = true;
        console.error("Error in start_washing:", error.message);
        MySwal.fire({
          title: "يوجد مشكله",
          text: "يوجد مشكله في الاتصال مع الماكينة!",
          icon: "warning",
          showCancelButton: false,
          confirmButtonText: "تم",
        });
      }
    }
  };
  return (
    <div className="package-item">
      <div className="card">
        <div className="front">
          <div className="package-title">{packageItem.name}</div>
          <div className="package-desc">
            {packageItem.description.length > 51
              ? packageItem.description.substring(0, 51) + "..."
              : packageItem.description}
          </div>
          <div className="package-price">
            <span>{packageItem.price}</span> ر.س
          </div>
        </div>
        <div className="back">
          <button
            onClick={() => start_washing(packageItem)}
            className="subscribe-button custom-btn btn-red"
          >
            ابدأ الآن
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarPackageView;
