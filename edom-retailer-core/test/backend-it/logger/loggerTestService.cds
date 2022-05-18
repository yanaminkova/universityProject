/*
 * Service to test logger functionality
 */
service LoggerTestService  @(path: '/test') {
    
   function WrongSQLQuery() returns {property: String;};
}
