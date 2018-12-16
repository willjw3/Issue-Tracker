# Issue Tracker
a freeCodeCamp project. 2nd of 5 projects of InfoSec and QA certification curriculum block.</br>
View the working application [here](https://bone-lavender.glitch.me/).</br>
## Documentation
        <ol>
          <li>Prevents cross-site scripting (XSS attacks)</li>
          <li>(Create) You can <b>POST</b> <code>/api/issues/{projectname}</code> with form data containing required <i>issue_title</i>, <i>issue_text</i>, <i>created_by</i>, and optional <i>assigned_to</i> and <i>status_text</i>.</li>
          <li>The issue saved (and returned) will include all of those fields (blank for optional no input) and also include <i>created_on</i>(date/time), <i>updated_on</i>(date/time), <i>open</i>(boolean, true for open, false for closed), and <i>_id</i>.</li>
          <li>(Read) You can <b>GET</b> <code>/api/issues/{projectname}</code> for an array of all issues on that specific project with all the information for each issue as was returned when posted.</li>
          <li>You can filter my get request by also passing along any field and value in the query(ie. <code>/api/issues/{project}?open=false</code>). I can pass along as many fields/values as I want.</li>
          <li>(Update) You can <b>PUT</b> <code>/api/issues/{projectname}</code> with a <i>_id</i> and any fields in the object with a value to object said object. Returned will be 'successfully updated' or 'could not update '+_id. This should always update <i>updated_on</i>. If no fields are sent return 'no updated field sent'.</li>
          <li>(Delete) You can <b>DELETE</b> <code>/api/issues/{projectname}</code> with a <i>_id</i> to completely delete an issue. If no _id is sent return '_id error', success: 'deleted '+_id, failed: 'could not delete '+_id.</li>
          <li>Passes 11 functional tests.</li>
        </ol>
