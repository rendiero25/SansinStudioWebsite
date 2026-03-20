import { useState, useEffect, useRef } from "react";
import Header from "../components/public/Header";
import Footer from "../components/public/Footer";
import { getSection, uploadBrief } from "../services/sectionApi";
import api from "../services/api";
import { SuccessModal } from "../components/public/insights/InsightsComponents";
import Skeleton from "../components/Skeleton";
import ScrollReveal from "../components/ScrollReveal";

interface ProcessItem {
  id: string;
  title: string;
  description: string;
  icon?: { url: string };
}

interface ContactData {
  title?: string;
  processTitle?: string;
  processes?: ProcessItem[];
  formTitle?: string;
  backgroundImage?: { url: string };
}

const Contact = () => {
  const [data, setData] = useState<ContactData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    brandName: "",
    email: "",
    otherContacts: "",
    needs: "",
    solutions: [] as string[],
    timelineNumber: 0,
    timelineUnit: "Weeks",
    investmentRange: 0,
    investmentCurrency: "IDR",
    scheduleDate: "",
    scheduleTime: "Select time",
    privacyAccepted: false,
    attachedFiles: [] as File[],
  });

  // Calendar State
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  const [footerBg, setFooterBg] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [contactRes, projSection3Res] = await Promise.all([
          getSection("contact", "main"),
          getSection("projects", "section3"),
        ]);
        setData(contactRes.content || {});
        setFooterBg(projSection3Res?.content?.backgroundImage?.url || "");
      } catch (err) {
        console.error("Failed to fetch contact data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (solution: string) => {
    setFormData((prev) => {
      const isSelected = prev.solutions.includes(solution);
      return {
        ...prev,
        solutions: isSelected
          ? prev.solutions.filter((s) => s !== solution)
          : [...prev.solutions, solution],
      };
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prev) => ({
        ...prev,
        attachedFiles: [...prev.attachedFiles, ...Array.from(e.target.files!)],
      }));
    }
  };

  const removeFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      attachedFiles: prev.attachedFiles.filter((_, i) => i !== index),
    }));
  };

  const formatDate = (date: Date) => {
    const d = date.getDate().toString().padStart(2, "0");
    const m = (date.getMonth() + 1).toString().padStart(2, "0");
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
  };

  const handleDateSelect = (date: Date) => {
    setFormData((prev) => ({
      ...prev,
      scheduleDate: formatDate(date),
    }));
    setShowCalendar(false);
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const days = [];

    // Padding for first week
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Actual days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    );
  };

  const isFormValid = () => {
    return (
      formData.name.trim() !== "" &&
      formData.brandName.trim() !== "" &&
      formData.email.trim() !== "" &&
      formData.needs.trim() !== "" &&
      formData.solutions.length > 0 &&
      formData.timelineNumber > 0 &&
      formData.scheduleDate.trim() !== "" &&
      formData.privacyAccepted &&
      formData.attachedFiles.length > 0
    );
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      // 1. Upload files to Cloudinary
      const uploadedFiles = await Promise.all(
        formData.attachedFiles.map(async (file) => {
          const result = await uploadBrief(file);
          return { name: file.name, url: result.url, publicId: result.publicId };
        }),
      );

      // 2. Prepare payload
      const payload = {
        name: formData.name,
        brandName: formData.brandName,
        email: formData.email,
        otherContacts: formData.otherContacts,
        needs: formData.needs,
        solutions: formData.solutions,
        timeline: {
          number: formData.timelineNumber,
          unit: formData.timelineUnit,
        },
        investment: {
          range: formData.investmentRange,
          currency: formData.investmentCurrency,
        },
        schedule: {
          date: formData.scheduleDate,
          time: formData.scheduleTime,
        },
        attachedFiles: uploadedFiles,
      };

      // 3. Send to backend
      const response = await api.post("/api/contact/submit", payload);

      if (response.data.success) {
        setShowModal(true);
        // Reset form
        setFormData({
          name: "",
          brandName: "",
          email: "",
          otherContacts: "",
          needs: "",
          solutions: [],
          timelineNumber: 0,
          timelineUnit: "Weeks",
          investmentRange: 0,
          investmentCurrency: "IDR",
          scheduleDate: "",
          scheduleTime: "Select time",
          privacyAccepted: false,
          attachedFiles: [],
        });
      }
    } catch (err) {
      console.error("Submission failed:", err);
      alert("Failed to submit project. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="contact-page bg-white font-primary flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex flex-col lg:flex-row">
          <div className="w-full lg:w-[55%] relative flex flex-col py-20 lg:py-0 bg-black/5">
            <div className="container mx-auto px-6 md:px-12 xl:px-20 z-10 w-full pt-20 lg:pt-32 flex flex-col justify-center">
              <div className="flex flex-col gap-12 lg:gap-16">
                <Skeleton
                  dark
                  className="w-[90%] max-w-2xl h-[40px] md:h-[60px]"
                />
                <div className="flex flex-col lg:flex-row justify-between items-start gap-8 lg:gap-12">
                  <Skeleton dark className="w-[150px] h-[30px]" />
                  <div className="flex flex-col items-center gap-6 w-full lg:max-w-[420px]">
                    <Skeleton className="w-full h-[180px] rounded-2xl" />
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <Skeleton className="w-full h-[180px] rounded-2xl" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full lg:flex-1 p-8 md:p-20 xl:p-32 bg-white flex flex-col justify-center">
            <div className="max-w-3xl lg:max-w-full flex flex-col gap-12 w-full">
              <Skeleton className="w-[60%] h-[40px]" />
              <div className="flex flex-col gap-8 w-full">
                <div className="flex flex-col gap-x-8 gap-y-8">
                  <Skeleton className="w-full h-[54px] rounded-lg" />
                  <Skeleton className="w-full h-[54px] rounded-lg" />
                  <Skeleton className="w-full h-[54px] rounded-lg" />
                </div>
                <Skeleton className="w-full h-[120px] rounded-lg" />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="contact-page bg-white font-primary flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col lg:flex-row">
        {/* Left Column: Info & Processes (With Background & Overlay) */}
        <div
          className="w-full lg:w-[55%] relative flex flex-col py-20 lg:py-0"
          style={{
            backgroundImage: data?.backgroundImage?.url
              ? `url(${data.backgroundImage.url})`
              : "none",
            backgroundSize: "cover",
            backgroundPosition: "top",
          }}
        >
          {/* Container for Content */}
          <div className="container mx-auto px-6 md:px-12 xl:px-20 z-10 w-full pt-10 lg:pt-30 flex flex-col justify-center">
            <div className="flex flex-col gap-12 lg:gap-16">
              <ScrollReveal delay={0.1}>
                <h1 className="text-[30px] uppercase md:text-[42px] lg:text-[42px] font-normal tracking-[-0.03em] leading-[1.1] m-0 text-white max-w-2xl">
                  {data?.title ||
                    ""}
                </h1>
              </ScrollReveal>

              <div className="flex flex-col lg:flex-row justify-between items-start gap-8 lg:gap-12">
                <ScrollReveal
                  delay={0.2}
                  direction="right"
                  className="w-full lg:w-[200px] shrink-0"
                >
                  <h2 className="text-[20px] md:text-[24px] font-normal tracking-[-0.02em] leading-tight m-0 text-white/90">
                    {data?.processTitle}
                  </h2>
                </ScrollReveal>

                <div className="flex flex-col items-center gap-6 w-full lg:max-w-[420px]">
                  {data?.processes?.map((process, index) => (
                    <ScrollReveal
                      key={process.id}
                      delay={0.2 + index * 0.1}
                      direction="right"
                      className="w-full flex flex-col items-center gap-6"
                    >
                      {/* Process Card */}
                      <div className="w-full bg-white rounded-2xl p-8 md:p-10 shadow-2xl shadow-black/15">
                        <div className="flex flex-col gap-6">
                          <div className="flex items-center gap-4">
                            {process.icon?.url && (
                              <img
                                src={process.icon.url}
                                alt=""
                                className="w-8 h-8 object-contain"
                              />
                            )}
                            <h3 className="text-[22px] md:text-[26px] font-medium m-0 tracking-tight text-black leading-tight">
                              {process.title}
                            </h3>
                          </div>
                          <p className="text-[14px] md:text-[15px] text-black/70 leading-relaxed m-0 font-medium">
                            {process.description}
                          </p>
                        </div>
                      </div>

                      {/* Arrow Icon (if not last) */}
                      {index < (data?.processes?.length || 0) - 1 && (
                        <div className="w-10 h-10 bg-[#D8B8F4] backdrop-blur-md rounded-full flex items-center justify-center shrink-0">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="black"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="6 9 12 15 18 9"></polyline>
                          </svg>
                        </div>
                      )}
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="w-full lg:flex-1 p-8 md:p-20 xl:p-32 bg-white flex flex-col justify-center">
          <ScrollReveal
            delay={0.3}
            className="max-w-3xl lg:max-w-full flex flex-col gap-12"
          >
            <h2 className="text-[28px] md:text-[36px] font-normal tracking-[-0.02em] leading-tight max-w-lg">
              {data?.formTitle || "Tell us about your project"}
            </h2>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-8 w-full"
            >
              {/* Form implementation based on Image 2 will go here */}
              <div className="flex flex-col gap-x-8 gap-y-8">
                <div className="flex flex-col gap-3">
                  <label className="text-[17px] font-bold text-black/80">
                    Name (Brand PIC/Personal)*
                  </label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    type="text"
                    placeholder="Mr/Mrs"
                    className="bg-[#F2F2F2] border-none rounded-lg px-5 py-4 text-[15px] focus:outline-none focus:ring-1 focus:ring-black/5 transition-all placeholder:text-black/30"
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <label className="text-[17px] font-bold text-black/80">
                    Brand/company name*
                  </label>
                  <input
                    name="brandName"
                    value={formData.brandName}
                    onChange={handleInputChange}
                    type="text"
                    placeholder="Company"
                    className="bg-[#F2F2F2] border-none rounded-lg px-5 py-4 text-[15px] focus:outline-none focus:ring-1 focus:ring-black/5 transition-all placeholder:text-black/30"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-x-8 gap-y-8">
                <div className="flex flex-col gap-3">
                  <label className="text-[17px] font-bold text-black/80">
                    Email*
                  </label>
                  <div className="relative">
                    <input
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      type="email"
                      placeholder="Email"
                      className="w-full bg-[#F2F2F2] border-none rounded-lg px-5 py-4 text-[15px] focus:outline-none focus:ring-1 focus:ring-black/5 transition-all placeholder:text-black/30"
                    />
                    <div
                      className={`absolute right-5 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full transition-colors ${formData.email.includes("@") ? "bg-green-500" : "bg-red-500"}`}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <label className="text-[17px] font-bold text-black/80">
                    Other contacts
                  </label>
                  <input
                    type="text"
                    placeholder="Phone numbers (please enter '-' if you're not willing to share)"
                    className="bg-[#F2F2F2] border-none rounded-lg px-5 py-4 text-[15px] focus:outline-none focus:ring-1 focus:ring-black/5 transition-all placeholder:text-black/25"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-[17px] font-bold text-black/80">
                  Tell us about your needs*
                </label>
                <textarea
                  name="needs"
                  value={formData.needs}
                  onChange={handleInputChange}
                  rows={5}
                  placeholder="I got a problem with"
                  className="bg-[#F2F2F2] border-none rounded-lg px-5 py-4 text-[15px] focus:outline-none focus:ring-1 focus:ring-black/5 transition-all placeholder:text-black/30 resize-none"
                />
              </div>

              <div className="flex flex-col gap-3">
                <input
                  type="file"
                  multiple
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-fit py-2.5 px-6 bg-transparent border border-black/15 rounded-lg text-black text-[15px] font-bold hover:bg-black hover:text-white transition-all duration-300"
                >
                  Attach files*
                </button>
                {formData.attachedFiles.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.attachedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 bg-black/5 px-3 py-1.5 rounded-full text-[12px] font-medium group"
                      >
                        <span className="max-w-[150px] truncate">
                          {file.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-black/40 hover:text-red-500 transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-4 mt-4">
                <label className="text-[17px] font-bold text-black/80">
                  Do you have any spesific creative solution in mind?*
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: "Foundation", icon: "https://res.cloudinary.com/dumpj5vva/image/upload/v1772672465/sanxinstudio/solution/icons/qufpeli5sfmdtjcfxydj.png" },
                    { label: "Interaction", icon: "https://res.cloudinary.com/dumpj5vva/image/upload/v1772671883/sanxinstudio/solution/icons/pswtbbgspxsyb8l95wi0.png" },
                    { label: "Production", icon: "https://res.cloudinary.com/dumpj5vva/image/upload/v1772604334/sanxinstudio/solution/icons/hlvlrwoerltf58xhc34c.png" },
                    { label: "Recommend me", icon: "" },
                  ].map((choice) => (
                    <label
                      key={choice.label}
                      className="cursor-pointer group flex items-center gap-4 p-4 bg-white border border-black/8 rounded-lg hover:bg-black/2 transition-all"
                    >
                      <input
                        name="solutions"
                        checked={formData.solutions.includes(choice.label)}
                        onChange={() => handleCheckboxChange(choice.label)}
                        type="checkbox"
                        className="w-5 h-5 rounded border-black/20 accent-black cursor-pointer"
                      />
                      <span
                        className={`text-[17px] lg:text-[12px] 2xl:text-[17px] flex items-center gap-2.5 lg:gap-1 2xl:gap-2 font-semibold transition-colors ${formData.solutions.includes(choice.label) ? "text-black" : "text-black/50 group-hover:text-black/80"}`}
                      >
                        <span
                          className={`flex items-center justify-center transition-all ${formData.solutions.includes(choice.label) ? "grayscale-0 opacity-100" : "grayscale brightness-125 opacity-60 group-hover:grayscale-0 group-hover:opacity-100"}`}
                        >
                          {choice.icon ? (
                            <img 
                              src={choice.icon} 
                              alt="" 
                              className="w-4 h-4 object-contain" 
                            />
                          ) : null}
                        </span>
                        {choice.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex flex-col xl:flex-row gap-12 xl:gap-13 items-start mt-4">
                <div className="flex flex-col gap-3 w-full">
                  <label className="text-[17px] font-bold text-black/80">
                    I expect this to be done in..*
                  </label>
                  <div className="flex items-center gap-4 min-h-[54px] w-full">
                    <input
                      name="timelineNumber"
                      value={formData.timelineNumber}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          timelineNumber: parseInt(e.target.value) || 0,
                        }))
                      }
                      type="number"
                      className="flex-1 h-[54px] bg-[#F2F2F2] border-none rounded-lg px-5 py-3 text-[15px] font-medium focus:outline-none placeholder:text-black/30 appearance-none"
                    />

                    <div className="relative w-[70px] h-[54px] shrink-0">
                      <select
                        name="timelineUnit"
                        value={formData.timelineUnit}
                        onChange={handleInputChange}
                        className="w-full h-full bg-[#F2F2F2] border-none rounded-lg text-black/70 text-[14px] font-bold focus:outline-none appearance-none cursor-pointer p-2 pr-3"
                      >
                        <option value="Weeks">Day</option>
                        <option value="Weeks">Week</option>
                        <option value="Months">Month</option>
                      </select>
                      
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="black"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-7 flex flex-col gap-3 xl:ml-10 w-full">
                  <label className="text-[17px] font-bold text-black/80">
                    Investment range
                  </label>
                  <div className="flex items-center gap-4 min-h-[54px]">
                    <input
                      name="investmentRange"
                      value={formData.investmentRange === 0 ? "" : formData.investmentRange}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          investmentRange: parseInt(e.target.value) || 0,
                        }))
                      }
                      type="number"
                      placeholder="0"
                      className="flex-1 h-[54px] bg-[#F2F2F2] border-none rounded-lg px-5 py-3 text-[15px] font-medium focus:outline-none placeholder:text-black appearance-none"
                    />
                    <div className="relative w-[70px] h-[54px] shrink-0">
                      <select
                        name="investmentCurrency"
                        value={formData.investmentCurrency}
                        onChange={handleInputChange}
                        className="w-full h-full bg-[#F2F2F2] border-none rounded-lg px-3 py-2 text-black/70 text-[13px] font-bold focus:outline-none appearance-none cursor-pointer pr-6"
                      >
                        <option>IDR</option>
                        <option>USD</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="black"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-4">
                <label className="text-[17px] font-bold text-black/80">
                  Discovery meet schedule*
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[54px] relative">
                  <input
                    name="scheduleDate"
                    value={formData.scheduleDate}
                    onChange={handleInputChange}
                    type="text"
                    placeholder="DD/MM/YYYY"
                    className="h-[54px] bg-[#F2F2F2] border-none rounded-xl px-5 py-4 text-[15px] focus:outline-none placeholder:text-black/30 transition-all focus:ring-1 focus:ring-black/5"
                  />
                  <div className="relative min-h-[54px]">
                    <button
                      type="button"
                      onClick={() => setShowCalendar(!showCalendar)}
                      className="w-full h-full bg-[#F2F2F2] border-none rounded-lg px-5 py-3 text-[15px] font-medium text-left flex items-center justify-between cursor-pointer"
                    >
                      <span
                        className={
                          formData.scheduleDate ? "text-black" : "text-black/30"
                        }
                      >
                        Select date
                      </span>
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="black"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </button>

                    {showCalendar && (
                      <div className="absolute top-full left-0 mt-2 p-4 bg-white border border-black/10 rounded-2xl shadow-2xl z-100 w-[300px]">
                        <div className="flex items-center justify-between mb-4">
                          <button
                            type="button"
                            onClick={handlePrevMonth}
                            className="p-1 hover:bg-black/5 rounded-full transition-colors"
                          >
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="black"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="15 18 9 12 15 6"></polyline>
                            </svg>
                          </button>
                          <span className="font-bold text-[14px]">
                            {monthNames[currentDate.getMonth()]}{" "}
                            {currentDate.getFullYear()}
                          </span>
                          <button
                            type="button"
                            onClick={handleNextMonth}
                            className="p-1 hover:bg-black/5 rounded-full transition-colors"
                          >
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="black"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                          </button>
                        </div>
                        <div className="grid grid-cols-7 text-center mb-2">
                          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(
                            (d) => (
                              <span
                                key={d}
                                className="text-[11px] font-bold text-black/30"
                              >
                                {d}
                              </span>
                            ),
                          )}
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                          {generateCalendarDays().map((date, i) => (
                            <button
                              key={i}
                              type="button"
                              disabled={!date}
                              onClick={() => date && handleDateSelect(date)}
                              className={`h-8 w-8 rounded-lg flex items-center justify-center text-[13px] font-medium transition-all ${
                                !date
                                  ? "invisible"
                                  : "hover:bg-[#7526BF] hover:text-white"
                              } ${date && formatDate(date) === formData.scheduleDate ? "bg-[#7526BF] text-white" : "text-black/80"}`}
                            >
                              {date?.getDate()}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-6">
                <label className="relative flex items-center cursor-pointer">
                  <input
                    name="privacyAccepted"
                    checked={formData.privacyAccepted}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        privacyAccepted: e.target.checked,
                      }))
                    }
                    type="checkbox"
                    className="w-5 h-5 rounded border-black/20 accent-black cursor-pointer"
                  />
                </label>
                <span className="text-[13px] font-medium text-black/40">
                  I accept Sanxin's{" "}
                  <a
                    href="#"
                    className="text-black/80 underline underline-offset-2"
                  >
                    privacy policies
                  </a>
                </span>
              </div>

              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  disabled={!isFormValid() || isSubmitting}
                  className={`px-6 py-2 text-[15px] font-bold rounded-lg transition-all shadow-xl shadow-black/10 hover:shadow-black/20 ${
                    !isFormValid() || isSubmitting
                      ? "bg-black/30 text-white/50 cursor-not-allowed"
                      : "bg-[#7526BF] text-white cursor-pointer"
                  }`}
                >
                  {isSubmitting ? "Submitting..." : "Submit Project"}
                </button>
              </div>
            </form>
          </ScrollReveal>
        </div>
      </main>

      <Footer showCTA={false} backgroundImageOverride={footerBg} reachUsClassName="mt-30 lg:mt-10" />
      <SuccessModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        message="Our team will contact you soon"
      />
    </div>
  );
};

export default Contact;
