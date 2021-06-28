import axios from "axios";
import { gqlUrl, restUrl, apiKey } from "../env";

// const graphql = axios.create({
//     baseURL: gqlUrl
// });
// const graphqlWithKey = axios.create({
//     baseURL: gqlUrl,
//     headers: {
//         Authorization: apiKey
//     }
// });
// const rest = axios.create({
//     baseURL: restUrl
// });
// const restWithKey = axios.create({
//     baseURL: restUrl,
//     headers: {
//         Authorization: apiKey
//     }
// });

// REST restApi interceptors
// rest.interceptors.request.use(
//     config => {
//         const user = JSON.parse(localStorage.getItem("mv3"));
//         if (user.token) {
//             config.headers.Authorization = `Bearer ${user.token}`;
//         }
//         return config;
//     },
//     error => {
//         Promise.reject(error);
//     }
// );

// Graphql interceptors
// graphql.interceptors.request.use(
//     config => {
//         const user = JSON.parse(localStorage.getItem("mv3"));
//         if (user.token) {
//             config.headers.Authorization = `Bearer ${user.token}`;
//         }
//         return config;
//     },
//     error => {
//         Promise.reject(error);
//     }
// );

// const head = {
//     file: {
//         "Content-Type": "multipart/form-data"
//     }
// };

// ENDPOINTS
export default {
    auth: {
        login(creds) {
            //     return graphqlWithKey.post("/graphql", {
            //         query: `{
            //             marketingV1Login(username: "${creds.username}", password: "${btoa(
            //             creds.password
            //         )}") {
            //     employeeNumber
            //     firstName
            //     lastName
            //     fullName
            //     position
            //     email
            //     nmls
            //     isMagazineGiftProgramParticipant
            //     useAlternateContent
            //     userRoles
            //     cellPhone
            //     token
            //     tokenExpiration
            //     availability
            //     awayStartDatetime
            //     awayEndDatetime
            //     emailSubscriptions {
            //       type
            //     }
            //     emailSignatureOption {
            //       id
            //       name
            //     }
            //     notificationPreferences{
            //       id
            //       name
            //       type
            //       isNonAdmin
            //       isAdminOnly
            //       receiveEmail
            //       receiveNotification
            //     }
            //     notifications {
            //       isRead
            //       id
            //       destinationUrl
            //       createdDatetime
            //       message
            //     }
            //     branch {
            //       address1
            //       address2
            //       city
            //       state
            //       zip
            //       phone
            //       fax
            //     }
            //     assistants {
            //       employeeNumber
            //       fullName
            //     }
            //     assists {
            //       employeeNumber
            //       fullName
            //     }
            //   }
            // }`
            //     });
        },
        loginWithToken(token) {
            // return graphqlWithKey.post("/graphql", {
            //     query: `{
            //         marketingV1ValidateToken(token: "${token}") {
            //             employeeNumber
            //             firstName
            //             lastName
            //             fullName
            //             position
            //             email
            //             nmls
            //             isMagazineGiftProgramParticipant
            //             useAlternateContent
            //             userRoles
            //             cellPhone
            //             token
            //             tokenExpiration
            //             availability
            //             awayStartDatetime
            //             awayEndDatetime
            //             emailSubscriptions {
            //                 type
            //             }
            //             emailSignatureOption {
            //                 id
            //                 name
            //             }
            //             notificationPreferences{
            //                 id
            //                 name
            //                 type
            //                 isNonAdmin
            //                 isAdminOnly
            //                 receiveEmail
            //                 receiveNotification
            //             }
            //             notifications {
            //                 isRead
            //                 id
            //                 destinationUrl
            //                 createdDatetime
            //                 message
            //             }
            //             branch {
            //                 address1
            //                 address2
            //                 city
            //                 state
            //                 zip
            //                 phone
            //                 fax
            //             }
            //             assistants {
            //                 employeeNumber
            //                 fullName
            //             }
            //             assists {
            //                 employeeNumber
            //                 fullName
            //             }
            //         }
            //     }`
            // });
        },
        validateToken(token) {
        //     return graphqlWithKey.post("/graphql", {
        //         query: `{
        //     validateTokenV1(token: "${token}") {
        //       adAccount
        //     }
        //   }`,
        //     });
        },
    },
    emails: {
        // CREATED EMAIL ENDPOINTS
        fetchEmailData(id) {
            // return graphql.post("/graphql", {
            //     query: `{
            //         marketingV1GetEmailBatch(id: "${id}") {
            //             id
            //             audience
            //             campaignName
            //             content
            //             alternateContent
            //             sendTo
            //             sendDatetime
            //             createdDatetime
            //             status
            //             attachmentPath
            //             template {
            //                 id
            //             }
            //             recipients {
            //                 employeeNumber
            //                 fullName
            //             }
            //             emailType {
            //                 id
            //                 type
            //             }
            //         }
            //     }`,
            // });
        },
        fetchEmailsData() {
            // return graphql.post("/graphql", {
            //     query: `{
            //         marketingV1GetEmailBatch(id: null) {
            //             id
            //             audience
            //             campaignName
            //             content
            //             alternateContent
            //             sendTo
            //             sendDatetime
            //             createdDatetime
            //             status
            //             attachmentPath
            //             template {
            //                 id
            //             }
            //             recipients {
            //                 employeeNumber
            //                 fullName
            //             }
            //             emailType {
            //                 id
            //                 type
            //             }
            //         }
            //     }`,
            // });
        },
        fetchEmailTypesData() {
            // return graphql.post("/graphql", {
            //     query: `{
            //         marketingV1GetEmailTypes {
            //             id
            //             type
            //         }
            //     }`,
            // });
        },
        fetchEmailsTemplateData() {
            // return graphql.post("/graphql", {
            //     query: `{
            //         marketingV1GetEmailTemplate(id: null) {
            //             id
            //             name
            //             isActive
            //             header
            //             footer
            //             baseContent
            //             alternateBaseContent
            //             variables {
            //                 id
            //                 type
            //                 name
            //             }
            //         }
            //     }`,
            // });
        },
        reserveBatchId() {
            // return rest.get("/v1/emailBatchId");
        },
        createEmail(data) {
            // return rest.post("/v1/createEmail", data, { ...head.file });
        },
        deleteEmail(id) {
            // return rest.delete(`/v1/emailBatch/${id}`);
        },
        createTemplate(data) {
            // return rest.post("/v1/manageEmailTemplate", data);
        },
        deleteTemplateVariable(variableId) {
            // return rest.delete(`/v1/emailTemplateVariable/${variableId}`);
        },
        sendTestEmail(batchId, email) {
            // return rest.post(`/v1/sendTestEmail/${batchId}`, {
            //     recipientEmail: email,
            // });
        },
    },
    users: {
        cacheBuster() {
            // return graphql.post("/graphql", {
            //     query: `{
            //         marketingV1GetEmployee(id: null, resetCache: true){
            //             employeeNumber
            //         }
            //     }`,
            // });
        },
        fetchEmployees() {
            // return graphql.post("/graphql", {
            //     query: `{
            //         marketingV1GetEmployee(id: null){
            //             employeeNumber
            //             firstName
            //             lastName
            //             fullName
            //             email
            //             userRoles
            //             availability
            //             awayEndDatetime
            //         }
            //     }`,
            // });
        },
        fetchEmployee(employeeNumber) {
            // return graphql.post("/graphql", {
            //     query: `{
            //         marketingV1GetEmployee(id: "${employeeNumber}"){
            //             employeeNumber
            //             firstName
            //             lastName
            //             fullName
            //             position
            //             email
            //             nmls
            //             isMagazineGiftProgramParticipant
            //             useAlternateContent
            //             userRoles
            //             cellPhone
            //             availability
            //             awayStartDatetime
            //             awayEndDatetime
            //             emailSubscriptions {
            //                 type
            //             }
            //             emailSignatureOption {
            //                 id
            //                 name
            //             }
            //             notificationPreferences {
            //                 id
            //                 name
            //                 type
            //                 isNonAdmin
            //                 isAdminOnly
            //                 receiveEmail
            //                 receiveNotification
            //             }
            //             notifications {
            //                 isRead
            //                 id
            //                 destinationUrl
            //                 createdDatetime
            //                 message
            //             }
            //             branch {
            //                 address1
            //                 address2
            //                 city
            //                 state
            //                 zip
            //                 phone
            //                 fax
            //             }
            //             assistants {
            //                 employeeNumber
            //                 fullName
            //             }
            //             assists {
            //                 employeeNumber
            //                 fullName
            //             }
            //         }
            //     }`,
            // });
        },
        fetchEmployeeNotificationPreferences(employeeNumber) {
            // return graphql.post("/graphql", {
            //     query: `{
            //         marketingV1GetEmployee(id: "${employeeNumber}"){
            //             employeeNumber
            //             fullName
            //             email
            //             availability
            //             notificationPreferences {
            //                 name
            //                 receiveNotification
            //             }
            //         }
            //     }`,
            // });
        },
        fetchSuperAdminNotificationPreferences() {
            // return graphql.post("/graphql", {
            //     query: `{
            //         marketingV1GetMarketingAdmin {
            //             employeeNumber
            //             email
            //             fullName
            //             availability
            //             notificationPreferences {
            //                 name
            //                 receiveNotification
            //             }
            //         }
            //     }`,
            // });
        },
        fetchEmployees_short() {
            // return graphql.post("/graphql", {
            //     query: `{
            //         marketingV1GetEmployee(id: null){
            //             employeeNumber
            //             firstName
            //             lastName
            //             fullName
            //             position
            //             email
            //         }
            //         marketingV1GetLoanOfficers {
            //             employeeNumber
            //             fullName
            //             email
            //         }
            //         marketingV1GetMarketingEmployees {
            //             employeeNumber
            //             fullName
            //             email
            //         }
            //     }`,
            // });
        },
        fetchLoanOfficers_short() {
            // return graphqlWithKey.post("/graphql", {
            //     query: `{
            //         marketingV1GetLoanOfficers {
            //             employeeNumber
            //             fullName
            //             firstName
            //             lastName
            //             email
            //         }
            //     }`,
            // });
        },
        fetchMarketingEmployees_short() {
            // return graphql.post("/graphql", {
            //     query: `{
            //         marketingV1GetMarketingEmployees {
            //             employeeNumber
            //             fullName
            //             email
            //             position
            //             notificationPreferences {
            //                 id
            //                 name
            //                 type
            //                 receiveEmail
            //                 receiveNotification
            //             }
            //         }
            //     }`,
            // });
        },
        fetchUserWebsiteBio(data) {
            // return graphql.post("/graphql", {
            //     query: `{
            //         marketingV1GetUserWebsiteBio(firstName: "${data.firstName}", lastName: "${data.lastName}")
            //     }`,
            // });
        },
        fetchUserSignaturePreferences() {
            // return graphql.post("/graphql", {
            //     query: `{
            //         marketingV1GetEmailSignatureOptions {
            //             id
            //             name
            //         }
            //     }`,
            // });
        },
        updateMagazineGiftProgramParticipation(data) {
            // employeeNumber: Int, mgp: Bool
            // return rest.post("/v1/updateMagazineGiftProgram", data);
        },
        updateAssistants(data) {
            // employeeNumber: Int, assistants: [{ employeeNumber: String }]
            // return rest.post("/v1/updateAssistants", data);
        },
        updateAvailability(data) {
            // employeeNumber: Int, availability: String, awayStartDatetime: String, awayEndDatetime: String
            // return rest.post("/v1/updateAvailability", data);
        },
        updatePreferences(data) {
            // employeeNumber: Int, notifcationPreferences: Array[{ id: Int, receiveEmail: Int, receiveNotification: Int }]
            // return rest.post("/v1/updatePreferences", data);
        },
        updateSignature(data) {
            // employeeNumber: String, displayHeadshot: Bool, displayOfficePhone: Bool, displayCellPhone: Bool
            // return rest.post("/v1/updateSignature", data);
        },
        updateUserAccessLevel(data) {
            // employeeNumber: String, userRoles: [String]
            // return rest.post("/v1/updateUserAccessLevel", data);
        },
        updateWebsiteBio(data) {
            // employeeNumber: Int, websiteBio: String <html>
            // return rest.post("/v1/updateWebsiteBio", data);
        },
        updateRpEmailCampaign(data) {
            // employeeNumber: Int, referralPartnerCampaign: Bool, useAlternateContent: Bool
            // return rest.post("/v1/updateReferralPartnerEmailCampaign", data);
        },
    },
    categoriesTopics: {
        cacheBuster() {
            // return graphql.post("/graphql", {
            //     query: `{
            //         marketingV1GetCategory(id: null, resetCache: true){
            //             name
            //         }
            //     }`,
            // });
        },
        fetchCategories() {
            // return graphql.post("/graphql", {
            //     query: `{
            //         marketingV1GetCategory(id: null){
            //             id
            //             name
            //             description
            //             sortOrder
            //             displayRealtor
            //             isActive
            //         }
            //     }`,
            // });
        },
        fetchCategoriesTopics() {
            // return graphql.post("/graphql", {
            //     query: `{
            //         marketingV1GetCategory(id: null){
            //             id
            //             name
            //             description
            //             sortOrder
            //             displayRealtor
            //             isActive
            //         }
            //         marketingV1GetTopic(name: null){
            //             name
            //             description
            //             isActive
            //         }
            //     }`,
            // });
        },
        manageCategory(data) {
            // return rest.post("/v1/manageCategory", data);
        },
        manageTopic(data) {
            // return rest.post("/v1/manageTopic", data);
        },
        deleteTopic(name) {
            // return rest.delete(`/v1/deleteTopic/${name}`);
        },
    },
    referralPartners: {
        fetchReferralPartners(queryString = "", employees = "") {
            // return graphql.post("/graphql", {
            //     query: `{
            //         marketingV1GetReferralPartners(queryString: "${queryString}", employees: "${employees}"){
            //             id
            //             email
            //             firstName
            //             lastName
            //             company
            //             isSubscribed
            //             subscribedDatetime
            //             unsubscribedDatetime
            //             employee {
            //                 employeeNumber
            //                 fullName
            //             }
            //             notes
            //         }
            //     }`,
            // });
        },
        manageReferralPartner(data) {
            // return rest.post("/v1/manageReferralPartner", data);
        },
        deleteReferralPartner(data) {
            // return rest.post("/v1/deleteReferralPartner", data);
        },
        uploadReferralPartners(data) {
            // return rest.post("/v1/uploadReferralPartners", data, {
            //     ...head.file,
            // });
        },
        createReferralPartner(data) {
            // return rest.post("/v1/createReferralPartner", data);
        },
    },
    products: {
        fetchAllProducts() {
            // return graphql.post("/graphql", {
            //     query: `{
            //         marketingV1GetProduct(id: null){
            //             id
            //             name
            //             description
            //             processingTime
            //             displayRealtor
            //             displayDiscover
            //             isDownload
            //             isCobrandable
            //             instantAssetPath
            //             isActive
            //             sortOrder
            //             createdDatetime
            //             updatedDatetime
            //             invoiceValue
            //             invoiceDescription
            //             rating
            //             reviewCount
            //             requires3rdParty
            //             orderCount
            //             category {
            //                 id
            //                 name
            //             }
            //             topics {
            //                 name
            //             }
            //             assignTo {
            //                 employeeNumber
            //                 fullName
            //                 email
            //             }
            //             secondaryAssignTo {
            //                 employeeNumber
            //                 fullName
            //                 email
            //             }
            //             productImages {
            //                 id
            //                 primary
            //                 filepaths {
            //                     path
            //                     type
            //                 }
            //             }
            //             formFields {
            //                 id
            //                 type
            //                 label
            //                 required
            //                 sortOrder
            //                 placeholder
            //                 value
            //                 options {
            //                     id
            //                     value
            //                 }
            //             }
            //         }
            //     }`,
            // });
        },
        fetchProduct(id) {
            // return graphql.post("/graphql", {
            //     query: `{
            //         marketingV1GetProduct(id: "${id}"){
            //             id
            //             name
            //             description
            //             processingTime
            //             displayRealtor
            //             displayDiscover
            //             isDownload
            //             isCobrandable
            //             instantAssetPath
            //             isActive
            //             sortOrder
            //             createdDatetime
            //             updatedDatetime
            //             invoiceValue
            //             invoiceDescription
            //             rating
            //             reviewCount
            //             requires3rdParty
            //             orderCount
            //             category {
            //                 id
            //                 name
            //             }
            //             topics {
            //                 name
            //             }
            //             assignTo {
            //                 employeeNumber
            //                 fullName
            //                 email
            //             }
            //             secondaryAssignTo {
            //                 employeeNumber
            //                 fullName
            //                 email
            //             }
            //             productImages {
            //                 id
            //                 primary
            //                     filepaths {
            //                         path
            //                         type
            //                     }
            //                 }
            //             formFields {
            //                 id
            //                 type
            //                 label
            //                 required
            //                 placeholder
            //                 sortOrder
            //                 value
            //                 options {
            //                     id
            //                     value
            //                 }
            //             }
            //         }
            //     }`,
            // });
        },
        fetchAllProductReviews(productId) {
            // return graphql.post("/graphql", {
            //     query: `{
            //         marketingV1GetProductReview(
            //             employeeNumber: null,
            //             productId: ${productId}
            //         ) {
            //             rating
            //             comment
            //             datetime
            //             employee {
            //                 fullName
            //                 employeeNumber
            //             }
            //             product {
            //                 id
            //             }
            //         }
            //     }`,
            // });
        },
        fetchProductReview(data) {
            // return graphql.post("/graphql", {
            //     query: `{
            //         marketingV1GetProductReview(
            //             employeeNumber: ${data.employeeId},
            //             productId: ${data.productId}
            //         ) {
            //             rating
            //             comment
            //         }
            //     }`,
            // });
        },
        manageProduct(data) {
            // return rest.post("/v1/manageProduct", data);
        },
        postProductReview(data) {
            // takes productId
            // return rest.post("/v1/manageProductReview", data);
        },
        deleteProductReview(data) {
            // return rest.delete(`/v1/deleteProductReview/${data.employeeNumber}/${data.productId}`);
        },
        bulkUpdateProducts(data) {
            // return rest.post("/v1/manageBulkProducts", data);
        },
    },
    orders: {
        cacheBuster() {
            // return graphql.post("/graphql", {
            //     query: `{
            //         marketingV1GetOrders(id: null, resetCache: true){
            //             id
            //         }
            //     }`,
            // });
        },
        // FETCHING
        fetchAllOrders() {
            // return graphql.post("/graphql", {
            //     query: `{
            //         marketingV1GetOrders(id: null){
            //             id
            //             dueDate
            //             orderedDatetime
            //             status
            //             product {
            //                 id
            //                 name
            //                 category {
            //                     id
            //                 }
            //             }
            //             orderedFor {
            //                 employeeNumber
            //                 fullName
            //                 email
            //             }
            //             orderedBy {
            //                 employeeNumber
            //                 fullName
            //                 email
            //             }
            //             assignedTo {
            //                 employeeNumber
            //                 fullName
            //                 email
            //             }
            //             followers {
            //                 employeeNumber
            //                 fullName
            //                 email
            //             }
            //         }
            //     }`,
            // });
        },
        fetchOrder(id) {
            // return graphql.post("/graphql", {
            //     query: `{
            //         marketingV1GetOrders(id: "${id}"){
            //             id
            //             dueDate
            //             orderedDatetime
            //             status
            //             product {
            //                 id
            //                 name
            //                 category {
            //                     id
            //                     name
            //                 }
            //                 isDownload
            //                 isCobrandable
            //                 requires3rdParty
            //             }
            //             orderedFor {
            //                 employeeNumber
            //                 fullName
            //                 email
            //             }
            //             orderedBy {
            //                 employeeNumber
            //                 fullName
            //                 email
            //             }
            //             assignedTo {
            //                 employeeNumber
            //                 fullName
            //                 email
            //             }
            //             followers {
            //                 employeeNumber
            //                 fullName
            //                 email
            //                 notificationPreferences {
            //                     id
            //                     name
            //                     receiveEmail
            //                     receiveNotification
            //                 }
            //             }
            //             details {
            //                 id
            //                 label
            //                 type
            //                 value
            //             }
            //             deliverables {
            //                 id
            //                 status
            //                 createdDatetime
            //                 assets {
            //                     id
            //                     filepath
            //                     type
            //                 }
            //                 versions {
            //                     id
            //                     filepath
            //                     datetime
            //                 }
            //             }
            //             orderActivity {
            //                 id
            //                 datetime
            //                 note
            //                 employee {
            //                     employeeNumber
            //                     fullName
            //                     email
            //                 }
            //             }
            //             comments {
            //                 id
            //                 comment
            //                 isAdmin
            //                 datetime
            //                 integerDatetime
            //                 filepath
            //                 employee {
            //                     employeeNumber
            //                     fullName
            //                     email
            //                 }
            //             }
            //         }
            //     }`,
            // });
        },
        fetchDownloadBlob(url) {
            // return axios({
            //     method: "get",
            //     url,
            //     responseType: "blob",
            // });
        },
        // ORDER PLACEMENT
        placeOrder(data) {
            // return rest.post("/v1/placeOrder", data);
        },

        // MUTATIONS
        bulkUpdateOrders(data) {
            return rest.post("/v1/manageBulkOrders", data);
        },
        updateDueDate(data) {
            return rest.post("/v1/updateDueDate", data);
        },
        updateAssignee(data) {
            return rest.post("/v1/updateAssignee", data);
        },
        updateOrderStatus(data) {
            return rest.post("/v1/updateOrderStatus", data);
        },
        manageComment(data) {
            return rest.post("/v1/manageComment", data);
        },
        manageDeliverable(data) {
            return rest.post("/v1/manageDeliverable", data, { ...head.file });
        },
        manageOrderFollower(data) {
            return rest.post("/v1/manageOrderFollower", data);
        },
        replaceDeliverable(data) {
            return rest.post("/v1/replaceDeliverable", data, { ...head.file });
        },
        createOrderActivity(data) {
            return rest.post("/v1/createOrderActivity", data);
        },
        addOrderFollower(data) {
            return rest.post("/v1/addOrderFollower", data);
        },
        deleteOrder(id) {
            return rest.delete(`/v1/deleteOrder/${id}`);
        },
        deleteDeliverable(id) {
            return rest.delete(`/v1/deleteDeliverable/${id}`);
        },
        deleteComment(id) {
            return rest.delete(`/v1/deleteComment/${id}`);
        },
        deleteOrderFollower(orderId, employeeNumber) {
            return rest.delete(`/v1/deleteOrderFollower/${orderId}/${employeeNumber}`);
        },
    },
    notifications: {
        createNotification(data) {
            // return rest.post("/v1/createNotification", data);
        },
        manageNotification(data) {
            // return rest.post("/v1/manageNotification", data);
        },
    },
    teams: {
        fetchTeams() {
            // return graphql.post("/graphql", {
            //     query: `{
            //         marketingV1GetTeam(id: null){
            //             id
            //             name
            //             bio
            //             leader {
            //                 employeeNumber
            //                 fullName
            //             }
            //             template
            //             url
            //             isActive
            //             members {
            //                 employeeNumber
            //                 fullName
            //             }
            //         }
            //     }`,
            // });
        },
        cacheBuster() {
            // return graphql.post("/graphql", {
            //     query: `{
            //         marketingV1GetTeam(id: null, resetCache: true){
            //             name
            //         }
            //     }`,
            // });
        },
        manageTeam(data) {
            // return rest.post("/v1/manageTeam", data);
        },
    },
    magazines: {
        fetchMagazines() {
            // return graphqlWithKey.post("/graphql", {
            //     query: `{
            //         marketingV1GetMagazine(id: null){
            //             id
            //             title
            //             image
            //             description
            //             isActive
            //         }
            //     }`,
            // });
        },
        fetchClosedLoansByEmployeeNumber(employeeNumber) {
            // return graphql.post("/graphql", {
            //     query: `{
            //         marketingV1GetLoans(id: "${employeeNumber}"){
            //             loanNumber
            //             closeDate
            //             firstName
            //             lastName
            //             email
            //             address
            //             city
            //             state
            //             zip
            //             magazine {
            //                 id
            //                 title
            //             }
            //             loanOfficer {
            //                 fullName
            //             }
            //         }
            //     }`,
            // });
        },
        fetchClosedLoansByLoanNumber(loanNumber) {
            // return graphqlWithKey.post("/graphql", {
            //     query: `{
            //         marketingV1GetLoan(loanNumber: "${loanNumber}"){
            //             loanNumber
            //             closeDate
            //             firstName
            //             lastName
            //             email
            //             address
            //             city
            //             state
            //             zip
            //             magazine {
            //                 id
            //                 title
            //             }
            //             loanOfficer {
            //                 fullName
            //             }
            //         }
            //     }`,
            // });
        },
        manageMagazine(data) {
            // return rest.post("/v1/manageMagazine", data);
        },
        setMagazineChoice(data) {
            // return restWithKey.post("/v1/setMagazineChoice", data);
        },
        manageBorrowerInformation(data) {
            // return restWithKey.post("/v1/manageBorrowerInformation", data);
        },
        exportMGP() {
            // return rest.post("/v1/export-mgp");
        },
        cacheBuster() {
            // return graphql.post("/graphql", {
            //     query: `{
            //         marketingV1GetMagazine(id: null, resetCache: true){
            //             id
            //         }
            //     }`,
            // });
        },
    },
    catalog: {
        register(data) {
            // return graphqlWithKey.post("/graphql", {
            //     query: `{
            //         registerV1(
            //             firstName: "${data.firstName}"
            //             lastName: "${data.lastName}"
            //             username: "${data.email}"
            //             email: "${data.email}"
            //             password: "${btoa(data.password)}"
            //             preferredLo: "${data.preferredLo}"
            //         ) {
            //             status
            //             message
            //             misc
            //         }
            //     }`,
            // });
        },
        forgotPassword(username) {
        //     return graphqlWithKey.post("/graphql", {
        //         query: `{
        //     forgotPasswordV1(username: "${username}") {
        //       status
        //       message
        //       misc
        //     }
        //   }`,
        //     });
        },
        sendProductInterest(data) {
            // return rest.post("/v1/interested", data);
        },
    },
    cobrand: {
        fetchCobrandInvoices() {
            // return graphql.post("/graphql", {
            //     query: `{
            //         marketingV1GetCobrandInvoices{
            //             id
            //             order {
            //                 id
            //             }
            //             productDescription
            //             loanOfficer {
            //                 employeeNumber
            //                 fullName
            //             }
            //             careOf {
            //                 id
            //                 fullName
            //                 email
            //             }
            //             proofOfAd
            //             notes
            //             invoicedDatetime
            //             status
            //         }
            //     }`,
            // });
        },
        manageCobrandInvoice(data) {
            /*
        orderNumber: String
        productDescription: String
        loanOfficer: {
            employeeNumber: Int
        }
        careOf: {
            fullName: String
            email: String
        }
        invoicedDate: Datetime/String
        status: String (Ordered/Invoiced)
        */
            // return rest.post("/v1/manageCobrandInvoice", data);
        },
    },
    reports: {
        fetchOrderLeaderboard(payload) {
            // return rest.get(
            //     `v1/report/marketingEmployeeOrderStatistics/${payload.startDate}/${payload.endDate}/`
            // );
        },
        fetchPopularProducts(payload) {
            // return rest.get(
            //     `v1/report/mostPopularProducts/${payload.startDate}/${payload.endDate}/${payload.orderBy}`
            // );
        },
        fetchOrderStatusCounts(payload) {
            // return rest.get(`v1/report/orderStatus/${payload.startDate}/${payload.endDate}`);
        },
        fetchPopularCategories(payload) {
            // return rest.get(
            //     `v1/report/mostPopularCategories/${payload.startDate}/${payload.endDate}`
            // );
        },
        fetchMostActiveEmployees(payload) {
            // return rest.get(
            //     `v1/report/mostActiveEmployees/${payload.startDate}/${payload.endDate}`
            // );
        },

        fetchMostActiveBranches(payload) {
            // return rest.get(`v1/report/mostActiveBranches/${payload.startDate}/${payload.endDate}`);
        },

        // exports
        exportPopularProducts(payload) {
            // return rest.get(
            //     `v1/report/export/mostPopularProducts/${payload.startDate}/${payload.endDate}`
            // );
        },
        exportMostActiveEmployees(payload) {
            // return rest.get(
            //     `v1/report/export/mostActiveEmployees/${payload.startDate}/${payload.endDate}`
            // );
        },
        exportMostActiveBranches(payload) {
            // return rest.get(
            //     `v1/report/export/mostActiveBranches/${payload.startDate}/${payload.endDate}`
            // );
        },
    },
};
