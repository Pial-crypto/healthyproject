"use client";
"use strict";
exports.__esModule = true;
var navigation_1 = require("next/navigation");
var react_1 = require("react");
var components_1 = require("@/app/components");
var link_1 = require("next/link");
var lucide_react_1 = require("lucide-react");
var Skeleton_1 = require("@/app/components/Skeleton");
var useProtectedRoute_1 = require("@/lib/hooks/useProtectedRoute");
function FeedbackList() {
    var router = navigation_1.useRouter();
    var _a = react_1.useState(true), isLoading = _a[0], setIsLoading = _a[1];
    var _b = react_1.useState(null), user = _b[0], setUser = _b[1];
    var _c = react_1.useState([]), projects = _c[0], setProjects = _c[1];
    var _d = react_1.useState([]), feedbacks = _d[0], setFeedbacks = _d[1];
    useProtectedRoute_1.useProtectedRoute(setUser, { clientFeedback: true, setProjects: setProjects, setFeedbacks: setFeedbacks }, "client", setIsLoading);
    if (isLoading)
        return React.createElement(Skeleton_1.SkeletonList, null);
    if (!user)
        return null;
    return (React.createElement("div", { className: "container mx-auto px-4 py-8" },
        React.createElement("div", { className: "mb-8" },
            React.createElement("h1", { className: "text-4xl font-bold text-gray-900 mb-2" }, "Keep Updated"),
            React.createElement("p", { className: "text-gray-600 text-lg" }, "Share your feedback on project progress and team communication.")),
        projects.length === 0 ? (React.createElement(components_1.Card, { className: "rounded-xl border border-gray-200 shadow-sm" },
            React.createElement(components_1.CardBody, { className: "p-8" },
                React.createElement(components_1.EmptyState, { title: "No projects available", description: "You currently have no active projects to give feedback on." })))) : (React.createElement("div", null,
            React.createElement("h2", { className: "text-2xl font-bold text-gray-900 mb-4" }, "Submit Feedback"),
            React.createElement("div", { className: "space-y-3" }, projects.map(function (project) { return (React.createElement("div", { key: project._id },
                React.createElement(link_1["default"], { key: project._id, href: {
                        pathname: "/client/feedback/" + project._id,
                        query: { name: project.name, id: project._id }
                    } },
                    React.createElement(components_1.Card, { className: "hover:shadow-xl transition-shadow cursor-pointer rounded-2xl border border-gray-200" },
                        React.createElement(components_1.CardBody, { className: "p-5" },
                            React.createElement("div", { className: "flex items-center justify-between gap-4" },
                                React.createElement("div", { className: "flex items-center gap-4" },
                                    React.createElement("div", { className: "flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-3xl font-bold" }, "\uD83D\uDCC1"),
                                    React.createElement("div", null,
                                        React.createElement("h3", { className: "text-2xl font-bold text-gray-900" },
                                            project.name,
                                            " \uD83D\uDE80"),
                                        React.createElement("p", { className: "text-base text-gray-600 line-clamp-2" }, project.description || "No description provided."))),
                                React.createElement(components_1.Button, { size: "lg", className: "bg-blue-600 text-white hover:bg-blue-700 rounded-xl shadow-md px-5 py-2 text-lg font-semibold transition-all" }, "\u2728 New Feedback"))))),
                React.createElement("div", { className: "h-2" }))); })))),
        React.createElement("div", { className: "h-2" }),
        React.createElement("div", { className: "h-2" }),
        React.createElement("div", { className: "mb-8" },
            React.createElement("h2", { className: "text-2xl font-bold mb-4" }, "Feedbacks History"),
            feedbacks.length === 0 ? (React.createElement(components_1.Card, null,
                React.createElement(components_1.CardBody, null,
                    React.createElement(components_1.EmptyState, { title: "No Feedback Yet", description: "Submit your first weekly feedback" })))) : (feedbacks.map(function (feedback) {
                var _a;
                return (React.createElement(components_1.Card, { key: feedback._id, className: "mb-3 shadow-sm" },
                    React.createElement(components_1.CardBody, { className: "space-y-6 p-6 bg-white shadow-xl rounded-2xl" },
                        React.createElement("div", { className: "flex items-center justify-between gap-5" },
                            React.createElement("div", { className: "flex items-center gap-5" },
                                React.createElement("div", { className: "flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-3xl font-extrabold" }, "📁"),
                                React.createElement("div", null,
                                    React.createElement("h3", { className: "text-3xl font-bold text-gray-900" },
                                        ((_a = projects.find(function (p) { return p._id === feedback.projectId; })) === null || _a === void 0 ? void 0 : _a.name) || "Unknown Project",
                                        " \uD83D\uDE80"),
                                    React.createElement("p", { className: "flex items-center gap-2 text-base text-gray-500" },
                                        React.createElement(lucide_react_1.CalendarDays, { className: "h-5 w-5 text-gray-400" }),
                                        new Date(feedback.timeStamp).toLocaleDateString()))),
                            React.createElement("div", null,
                                React.createElement("span", { className: "bg-green-100 text-green-800 px-5 py-2 rounded-full text-base font-semibold animate-pulse" }, "\u2728 New Feedback"))),
                        React.createElement("p", { className: "text-xl text-gray-800 font-semibold" },
                            "\uD83D\uDCAC ",
                            feedback.comment || "No comment provided."),
                        React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-5 text-lg" },
                            React.createElement("div", { className: "flex items-center gap-4" },
                                React.createElement("span", { className: "inline-flex items-center gap-2 rounded-full bg-emerald-50 px-5 py-2 text-base font-medium text-emerald-700" }, "\u2B50 Satisfaction"),
                                React.createElement("span", { className: "text-gray-900 font-bold text-2xl" },
                                    feedback.satisfactionRating,
                                    "/5")),
                            React.createElement("div", { className: "flex items-center gap-4" },
                                React.createElement("span", { className: "inline-flex items-center gap-2 rounded-full bg-indigo-50 px-5 py-2 text-base font-medium text-indigo-700" }, "\uD83D\uDCAC Communication"),
                                React.createElement("span", { className: "text-gray-900 font-bold text-2xl" },
                                    feedback.communicationClarity,
                                    "/5"))),
                        React.createElement("div", { className: "mt-4" },
                            React.createElement("p", { className: "text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide" }, "\u26A0\uFE0F Reported Issue"),
                            feedback.issueDescription ? (React.createElement("div", { className: "flex items-center gap-4 rounded-2xl bg-amber-50 px-6 py-3 text-lg text-amber-800 border border-amber-200 shadow-sm" },
                                React.createElement("span", { className: "text-3xl" }, "\uD83D\uDEA8"),
                                React.createElement("span", { className: "font-semibold text-gray-900" }, feedback.issueDescription))) : (React.createElement("p", { className: "text-lg text-gray-500 font-semibold flex items-center gap-2" }, "\u2705 No issue reported"))))));
            })))));
}
exports["default"] = FeedbackList;
