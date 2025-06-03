import React, { useState, useEffect } from "react";
import "./App.css";
import "./style.css";
import PlotCanvas from "./gambleGame/PlotCanvas";

function App() {
  // Player stats
  const [balance, setBalance] = useState(5000);
  const [stage, setStage] = useState(1); // We'll go up to Stage 9
  const [route, setRoute] = useState(null);          // "career" or "college"
  const [collegeRole, setCollegeRole] = useState(null); // "engineering", "education", "professional"
  const [investedAmount, setInvestedAmount] = useState(0); // If user invests
  const [finalPackageMessage, setFinalPackageMessage] = useState("");
  const [message, setMessage] = useState("");

  // Track whether the user has already done the action for the current stage
  // e.g., {1: true} means they've done the Stage 1 action
  const [actionsDone, setActionsDone] = useState({});

  // For Stage 9 big "Thank You"
  const [thankYou, setThankYou] = useState(false);

  // Helper to mark an action as done so user can’t repeat
  const markActionDone = (stg) => {
    setActionsDone((prev) => ({ ...prev, [stg]: true }));
  };

  // Helper to check if action is already done
  const isActionDone = (stg) => !!actionsDone[stg];

  //
  // ─────────────────────────────────────────────────────────────────
  //   STAGE 1: PICK CAREER OR COLLEGE
  // ─────────────────────────────────────────────────────────────────
  //
  const handlePickCareer = () => {
    // Prevent multiple clicks
    if (isActionDone(1)) return;

    setBalance((prev) => prev + 200000);
    setRoute("career");
    setMessage("You chose Career! +$200,000. Please wait...");
    markActionDone(1); // can't re-click

    setTimeout(() => {
      setStage(2);
      setMessage("");
    }, 5000);
  };

  const handlePickCollege = () => {
    if (isActionDone(1)) return;

    setBalance((prev) => prev - 80000);
    setRoute("college");
    setMessage("You chose College! -$80,000. Now pick your major!");
    markActionDone(1);
  };

  const handlePickMajor = (major) => {
    // If they click a major multiple times, we don't want repeated changes
    if (isActionDone("1-major")) return;

    let newBalance = balance;
    if (major === "engineering") {
      newBalance += 500000;
    } else if (major === "education") {
      newBalance += 450000;
    } else if (major === "professional") {
      newBalance -= 250000;
    }
    setBalance(newBalance);
    setCollegeRole(major);
    setMessage(`You chose ${major}! New balance: $${newBalance}. Please wait...`);
    markActionDone("1-major");

    setTimeout(() => {
      setStage(2);
      setMessage("");
    }, 5000);
  };

  //
  // ─────────────────────────────────────────────────────────────────
  //   STAGE 2: FAMILY CHOICE
  // ─────────────────────────────────────────────────────────────────
  //
  const handleFamilyChoice = (choice) => {
    if (isActionDone(2)) return;

    let newBalance = balance;
    if (choice === "married") {
      newBalance -= 100000;
      setMessage(`You got married & had kids! -$100,000. Balance: $${newBalance}.`);
    } else {
      setMessage(`You stayed single. Balance: $${newBalance}.`);
    }
    setBalance(newBalance);
    markActionDone(2);

    setTimeout(() => {
      setStage(3);
      setMessage("");
    }, 5000);
  };

  //
  // ─────────────────────────────────────────────────────────────────
  //   STAGE 3: FINAL AWARD
  // ─────────────────────────────────────────────────────────────────
  //
  const handleFinalAward = () => {
    if (isActionDone(3)) return;

    let finalBalance = balance;
    const timeMessage = "A couple of years passed, and here’s how much you earned from your path: ";

    if (route === "career") {
      finalBalance += 100000;
      setMessage(`${timeMessage} +$100,000. New balance: $${finalBalance}. Please wait...`);
    } else {
      let addition = 0;
      if (collegeRole === "engineering") {
        addition = 200000;
      } else if (collegeRole === "education") {
        addition = 160000;
      } else if (collegeRole === "professional") {
        addition = 500000;
      }
      finalBalance += addition;
      setMessage(`${timeMessage} +$${addition}. New balance: $${finalBalance}. Please wait...`);
    }

    setBalance(finalBalance);
    markActionDone(3);

    setTimeout(() => {
      setStage(4);
      setMessage("");
    }, 5000);
  };

  //
  // ─────────────────────────────────────────────────────────────────
  //   STAGE 4: CAR ACCIDENT
  // ─────────────────────────────────────────────────────────────────
  //
  useEffect(() => {
    if (stage === 4) {
      // The user doesn’t click here; it’s automatic
      // But we only want to do it once
      if (!isActionDone(4)) {
        const newBal = balance - 30000;
        setBalance(newBal);
        setMessage(`Unexpected car accident! -$30,000. New balance: $${newBal}.`);
        markActionDone(4);

        setTimeout(() => {
          setStage(5);
          setMessage("");
        }, 5000);
      }
    }
    // eslint-disable-next-line
  }, [stage]);

  //
  // ─────────────────────────────────────────────────────────────────
  //   STAGE 5: PAY & INVEST OR GAMBLE
  // ─────────────────────────────────────────────────────────────────
  //
  const handlePayAndInvest = () => {
    if (isActionDone(5)) return;

    const newBal = balance - 50000;
    setBalance(newBal);
    setMessage(`You paid your bills & invested $50k! Balance: $${newBal}.`);
    markActionDone(5);
  };

  const handleGamble = () => {
    if (isActionDone(5)) return;

    const min = -50000;
    const max = 50000;
    const gambleResult = Math.floor(Math.random() * (max - min + 1)) + min;
    const newBal = balance + gambleResult;
    setBalance(newBal);
    setMessage(
      gambleResult >= 0
        ? `You gambled and won $${gambleResult}! New balance: $${newBal}.`
        : `You gambled and lost $${-gambleResult}! New balance: $${newBal}.`
    );
    markActionDone(5);
  };

  // Auto-advance after Stage 5
  useEffect(() => {
    if (stage === 5) {
      const timer = setTimeout(() => {
        setStage(6);
        setMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  //
  // ─────────────────────────────────────────────────────────────────
  //   STAGE 6: 20 YEARS LATER => FINAL PAYCHECK
  // ─────────────────────────────────────────────────────────────────
  //
  useEffect(() => {
    if (stage === 6) {
      if (!isActionDone(6)) {
        let newBal = balance;
        const timeMessage =
          "Another couple of years passed, and here’s your final paycheck for your chosen path: ";
        let addition = 0;

        if (route === "career") {
          addition = 300000;
        } else if (route === "college") {
          if (collegeRole === "engineering") {
            addition = 900000;
          } else if (collegeRole === "education") {
            addition = 700000;
          } else if (collegeRole === "professional") {
            addition = 4000000;
          }
        }
        newBal += addition;
        setBalance(newBal);
        setMessage(`${timeMessage} +$${addition}. New balance: $${newBal}.`);
        markActionDone(6);

        const timer = setTimeout(() => {
          setStage(7);
          setMessage("");
        }, 5000);

        return () => clearTimeout(timer);
      }
    }
    // eslint-disable-next-line
  }, [stage]);

  //
  // ─────────────────────────────────────────────────────────────────
  //   STAGE 7: FINAL INVEST OR GAMBLE
  // ─────────────────────────────────────────────────────────────────
  //
  const handleFinalInvest = () => {
    if (isActionDone(7)) return;

    setInvestedAmount(50000);
    setMessage("You chose to invest $50k (applied at the end).");
    markActionDone(7);
  };

  const handleFinalGamble = () => {
    if (isActionDone(7)) return;

    const sign = Math.random() < 0.5 ? -1 : 1;
    const amount = Math.floor(Math.random() * (50000 - 2000 + 1) + 2000);
    const gambleResult = sign * amount;
    const newBal = balance + gambleResult;
    setBalance(newBal);
    setMessage(
      gambleResult >= 0
        ? `Final gamble: you won $${gambleResult}! New balance: $${newBal}.`
        : `Final gamble: you lost $${-gambleResult}! New balance: $${newBal}.`
    );
    markActionDone(7);
  };

  useEffect(() => {
    if (stage === 7) {
      const timer = setTimeout(() => {
        setStage(8);
        setMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  //
  // ─────────────────────────────────────────────────────────────────
  //   STAGE 8: RETIREMENT
  // ─────────────────────────────────────────────────────────────────
  //
  useEffect(() => {
    if (stage === 8) {
      // Add any invested amount now, only once
      if (!isActionDone("8-invest") && investedAmount > 0) {
        const newBal = balance + investedAmount;
        setBalance(newBal);
        setMessage(`Your $${investedAmount} investment was added! New balance: $${newBal}.`);
        setInvestedAmount(0);
        markActionDone("8-invest");
      }
    }
    // eslint-disable-next-line
  }, [stage]);

  const handleRetirementChoice = (pkg) => {
    // Each user can only pick once
    if (isActionDone(8)) return;

    const bal = balance;
    switch (pkg) {
      case "frugal":
        if (bal < 300000 || bal > 600000) {
          setFinalPackageMessage("You can't pick Frugal unless you have 300k-600k.");
        } else {
          setFinalPackageMessage(
            "Frugal Life: You have a modest home, minimal travel, careful budgeting. Enjoy a simple retirement!"
          );
        }
        break;
      case "comfortable":
        if (bal < 600000 || bal > 2000000) {
          setFinalPackageMessage("You can't pick Comfortable unless you have 600k-2M.");
        } else {
          setFinalPackageMessage(
            "Comfortable Life: You can travel occasionally, have a nice home, and enjoy leisure activities without worry."
          );
        }
        break;
      case "lavish":
        if (bal < 2000000) {
          setFinalPackageMessage("You can't pick Lavish unless you have 2M+.");
        } else {
          setFinalPackageMessage(
            "Lavish Life: You enjoy first-class travel, luxury homes, and all the finer things—live it up!"
          );
        }
        break;
      default:
        setFinalPackageMessage("Unknown retirement package.");
        break;
    }

    markActionDone(8);

    // After picking, wait 5s => Stage 9
    setTimeout(() => {
      setStage(9);
    }, 5000);
  };

  //
  // ─────────────────────────────────────────────────────────────────
  //   STAGE 9: BIG THANK YOU
  // ─────────────────────────────────────────────────────────────────
  //
  useEffect(() => {
    if (stage === 9) {
      setThankYou(true);
    }
  }, [stage]);

  //
  //   RENDER LOGIC
  //
  let promptText = "";
  let options = [];

  if (stage === 1) {
    // Pick career or college
    if (!route) {
      promptText = "You just graduated high school! Choose Career or College:";
      // Show only if stage 1 action not done
      if (!isActionDone(1)) {
        options = [
          { label: "Career", onClick: handlePickCareer },
          { label: "College", onClick: handlePickCollege },
        ];
      }
    } else if (route === "college" && !collegeRole) {
      promptText = "Choose your major!";
      if (!isActionDone("1-major")) {
        options = [
          { label: "Engineering", onClick: () => handlePickMajor("engineering") },
          { label: "Education", onClick: () => handlePickMajor("education") },
          { label: "Professional", onClick: () => handlePickMajor("professional") },
        ];
      }
    } else {
      promptText = "Career chosen. Please wait...";
    }
  } else if (stage === 2) {
    promptText = "Family Stage: Get married & have kids (-$100k), or stay single (0)?";
    if (!isActionDone(2)) {
      options = [
        { label: "Married & Kids", onClick: () => handleFamilyChoice("married") },
        { label: "Stay Single", onClick: () => handleFamilyChoice("single") },
      ];
    }
  } else if (stage === 3) {
    promptText = "Time for your Stage 3 bonus!";
    if (!isActionDone(3)) {
      options = [{ label: "Apply Bonus", onClick: handleFinalAward }];
    }
  } else if (stage === 4) {
    promptText = "Car accident happening... -$30k. Please wait...";
  } else if (stage === 5) {
    promptText = "Pay off bills & invest $50k, or gamble (-50k to +50k)?";
    if (!isActionDone(5)) {
      options = [
        { label: "Pay & Invest", onClick: handlePayAndInvest },
        { label: "Gamble", onClick: handleGamble },
      ];
    }
  } else if (stage === 6) {
    promptText = "Another couple years pass... collecting your final paycheck. Please wait...";
  } else if (stage === 7) {
    promptText = "Last chance: Invest $50k (added at the end) or gamble ±2k-50k?";
    if (!isActionDone(7)) {
      options = [
        { label: "Invest", onClick: handleFinalInvest },
        { label: "Gamble", onClick: handleFinalGamble },
      ];
    }
  } else if (stage === 8) {
    promptText = `Congrats, you ended with $${balance}. Pick your retirement package:`;
    if (!isActionDone(8)) {
      options = [
        { label: "Frugal (300k-600k)", onClick: () => handleRetirementChoice("frugal") },
        { label: "Comfortable (600k-2M)", onClick: () => handleRetirementChoice("comfortable") },
        { label: "Lavish (2M+)", onClick: () => handleRetirementChoice("lavish") },
      ];
    }
  } else if (stage === 9) {
    promptText = "";
  }

  return (
    <div className="App">
      {/* LEFT PANEL */}
      <div className="left-panel">
        <h1 className="title">Fortune And Fate</h1>
        <div className="info-container">
          <h2 className="stage">Stage: {stage}</h2>
          <h2 className="balance">Balance: {balance}</h2>
        </div>
        <div className="main-screen">
          <div className="container">
            {/* Walking sprite */}
            <div className="walk1"></div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="right-panel">
        {thankYou && stage === 9 ? (
          <>
            <h1 style={{ color: "#333", textAlign: "center" }}>
              Thank you for playing **Fortune And Fate**!
            </h1>
            <p style={{ color: "#333", textAlign: "center", marginTop: "1rem" }}>
              We hope you learned something about managing money wisely, living within your means,
              and preparing for life's unexpected events. Remember:
              <br />
              <strong>Spend responsibly, save consistently, and gamble with caution.</strong>
            </p>
          </>
        ) : (
          <>
            <h1 className="situation-prompt">{promptText}</h1>
            {/* Only show the option buttons if they haven't taken the action yet */}
            {options.length > 0 && (
              <div className="option-grid">
                {options.map((opt, i) => (
                  <button key={i} className="option" onClick={opt.onClick}>
                    {opt.label}
                  </button>
                ))}
              </div>
            )}

            {message && (
              <p style={{ color: "#333", textAlign: "center", marginTop: "1rem" }}>
                {message}
              </p>
            )}

            {/* Show final retirement info (Stage 8) */}
            {stage === 8 && finalPackageMessage && (
              <p style={{ color: "#333", textAlign: "center", marginTop: "1rem" }}>
                {finalPackageMessage}
              </p>
            )}

            {/* FINANCIAL LITERACY MESSAGE (Optional) */}
            {stage >= 8 && !thankYou && (
              <div style={{ marginTop: "2rem", color: "#333", textAlign: "center" }}>
                <h2>Financial Literacy Insights</h2>
                <p>
                  In real life, it's wise to live within your means, spend responsibly, and
                  consider the risks of gambling. Consistent saving and smart investing often
                  lead to more stability than high-risk bets. A secure financial future comes
                  from balance, planning, and avoiding impulse decisions!
                </p>
              </div>
            )}
          </>
        )}

        <div>
          <h1>Gamble Game</h1>
          <PlotCanvas balance={balance} setBalance={setBalance} />
        </div>
      </div>
    </div>
  );
}

export default App;