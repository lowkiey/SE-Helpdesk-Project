const sessionModel = require("../Models/sessionModel");
const userModel = require("../Models/userModel");
const agentModel = require("../Models/Agent");
const ticketsModel = require("../Models/ticketsModel");
const AutomatedWorkflow = require("../Models/AutomatedWorkflow");

const ticketsController = require('./ticketsController');
const jwt = require("jsonwebtoken");
require('dotenv').config();
const secretKey = process.env.SECRET_KEY;
const bcrypt = require("bcrypt");

const automatedWorkflowController = {

  enqueue: (queue, element) => {
    queue.push(element);
  },

  // Function to check if the queue is empty
  isEmpty: (queue) => {
    return queue.length === 0;
  },

  // Function to create a queue
  createQueue: () => {
    return [];
  },

    // Create a new automated workflow
    createAutomatedWorkflow: async (req, res) => {
      console.log("hi");
      try {
        const {Category, subCategory} = req.body;
        let description = " ";
        //mehtagin ne3raf eh el description bta3 kol workflow details le kol category w subcategory
        if(Category === "Software" ){
          switch(subCategory){
            case "Operating System":
             description = `
              1. Check for Updates:
                - Navigate to "Settings" or "Control Panel."
                - Look for "Updates" or "System Updates."
                - Install any available updates for your operating system.

              2. Restart Your Computer:
                - Save any open work.
                - Restart your computer to apply changes.
                - Check if the issue persists after the restart.

              3. Run System Diagnostics:
                - Open "Command Prompt" as an administrator.
                - Run "sfc /scannow" to check for and repair corrupted system files.
              `
              break
              case " Application software": 
              description = `
              1-Update the Application:
              Open the application.
              Look for an "Update" or "Check for Updates" option.
              Install the latest version of the application.
              
              2-Clear Cache and Data:
              Access the application settings.
              Navigate to "Storage" or "App Info."
              Clear cache and data related to the application.
              
              3-Reinstall the Application:
              Uninstall the application.
              Download and reinstall the application from the official source.`

              break

              case"Custom software":
              description= `
              1-Check Documentation:
              Refer to the user manual or documentation for the custom software.
              Look for troubleshooting sections.
              
              2-Contact Support:
              Find the support contact information for the custom software.
              Reach out to the software vendor or developer for assistance.`

              break

              case"Integration issues":
              description = `
              1-Verify Input Data:
              Ensure that data entered into integrated systems is accurate.
              Check for any missing or incorrect information.
              
              2-Monitor Integration Status:
              If there's a dashboard or status page for integrations, check it.
              Look for error messages or status indicators.
              
              3-Contact IT or Helpdesk:
              If the integration issue persists, contact your IT department or helpdesk.
              Provide details about the systems involved and any error messages.`

              break

        }
      }
      else if(Category === "Hardware"){
        switch(subCategory){
          case "Desktops":
           description = `
           1. Check Power and Connections:
           - Ensure that all cables and power cords connected to the desktop are secure.
           - Verify that the power source is functional.
        
        2. Restart the Desktop:
           - Restart your desktop.
           - Shut down the desktop, wait for a few seconds, and then power it back on.
           - Check if the issue persists after the restart.
        
        3. Update Desktop Drivers:
           - Open "Device Manager" on your computer.
           - Locate the desktop-related devices.
           - Right-click on each device and select "Update driver."
           - Follow the on-screen instructions to update drivers.
        `
            break
        case"Laptops":
          description=`1. Check Power and Connections:
          - Ensure that the laptop is properly connected to the power source.
          - Verify that the power adapter is functioning correctly.
       
       2. Restart the Laptop:
          - Restart your laptop.
          - Shut down the laptop, wait for a few seconds, and then power it back on.
          - Check if the issue persists after the restart.
       
       3. Update Laptop Drivers:
          - Open "Device Manager" on your computer.
          - Locate the laptop-related devices.
          - Right-click on each device and select "Update driver."
          - Follow the on-screen instructions to update drivers.
       `
       break

       case "Printers":
        description= `1. Check Power and Connections:
        - Ensure that the printer is plugged into a power source.
        - Verify that all cables connecting the printer are secure.
     
     2. Restart the Printer:
        - Turn off the printer.
        - Wait for a few seconds and then turn the printer back on.
        - Check if the issue persists after the restart.
     
     3. Update Printer Drivers:
        - Open "Device Manager" on your computer.
        - Locate the printer-related devices.
        - Right-click on each device and select "Update driver."
        - Follow the on-screen instructions to update drivers.
     `
        break
       case "Servers":
        description=`1. Check Server Hardware:
        - Ensure that all server components are properly seated.
        - Verify that there are no loose connections inside the server.
     
     2. Restart the Server:
        - Restart the server.
        - Shut down the server, wait for a few seconds, and then power it back on.
        - Check if the issue persists after the restart.
     
     3. Monitor Server Logs:
        - Examine server logs for any error messages or warnings.
        - Address any issues indicated in the logs.
     
     4. Update Server Firmware:
        - Check for firmware updates for your server model.
        - Follow the manufacturer's instructions to update server firmware.
     `
          break
       case "Networking equipment":
        description=`1. Check Network Connections:
        - Ensure that all network cables are securely connected.
        - Verify that networking equipment (routers, switches) is powered on.
     
     2. Restart Networking Equipment:
        - Restart routers and switches.
        - Wait for a few seconds and then power them back on.
        - Check if the issue persists after the restart.
     
     3. Check Network Configuration:
        - Verify that the network configuration settings are correct.
        - Address any misconfigurations.
     
     4. Update Networking Device Firmware:
        - Check for firmware updates for your networking devices.
        - Follow the manufacturer's instructions to update firmware.
     `
          break
        
      }
    }
    else if(Category === "Network"){
      switch(subCategory){
        case "Email issues":
          description = `
          1- Check Email Account Settings:
          Verify that email account settings are configured correctly.
          Confirm the correctness of the username, password, and incoming/outgoing server settings.
          
          2-Clear Email Cache:
          Clear the cache in your email client to resolve potential data conflicts.
          Remove unnecessary emails and attachments to free up storage space.
          3- Test Email on Another Device: 
          Log in to your email account on a different device to check if the issue is device-specific.
          If emails work on another device, the problem may be with the original device or its settings.`
          break
        case "Internet Connection Issues":
          description=`
          1-Restart Network Devices:
          Restart your router and modem to refresh the network connection.
          Wait for a few seconds before powering them back on.
          
          2-Run Network Troubleshooter:
          Use the built-in network troubleshooter on your operating system to identify and fix common connectivity issues.
          Follow the troubleshooter's recommendations for problem resolution.
          
          3-Check for Interference: 
          Identify potential sources of interference, such as other electronic devices or competing Wi-Fi networks.
          Adjust the Wi-Fi channel on your router to minimize interference.`
          break
        case "Website Error":
          description=`
          1-Clear Browser Cache and Cookies:
          Clear your browser's cache and cookies to resolve issues related to outdated or corrupted data.
          Reload the website after clearing the cache.
          
          2- Use Incognito/Private Browsing Mode:
          Open the website in incognito or private browsing mode to rule out issues caused by browser extensions or cached data.
          If the site works in incognito mode, try disabling browser extensions.
          
          3-Check Website URL and Protocol:
          Ensure the website URL is correct and properly formatted (e.g., "https://" if necessary).
          Verify that the website is using a secure connection (SSL/TLS) by checking for "https://" in the URL.`
          break
    }
  };
        const newWorkflow = new AutomatedWorkflow({
          issueType: Category,
          workflowType: subCategory,
          workflowDetails: description,
        });
        await newWorkflow.save();
        res.status(201).json({ message: 'Automated workflow successfully', description});
      } catch(err){
        console.error('Error creating automated workflow:', err);
        res.status(500).json({ message: 'Server error' });
      }
    },

    //  sleep: (ms) => {
    //   return new Promise((resolve) => setTimeout(resolve, ms));
    // },
  



    createAutomatedWorkflowWithRouting: async (req, res) => {
      const highQueue = automatedWorkflowController.createQueue();
      const mediumQueue = automatedWorkflowController.createQueue();
      const lowQueue = automatedWorkflowController.createQueue();

      try {

        //tickets with status open in an array
        const openTickets = await ticketsModel.find({ status: 'open' });
        console.log("open tickets: ",openTickets)
        //loop on open tickets to push in priority queues
        for (const ticket of openTickets) {
          switch (ticket.priority) {
            case 'high':
              highQueue.push(ticket);
              break;
            case 'medium':
              mediumQueue.push(ticket);
              break;
            case 'low':
              lowQueue.push(ticket);
              break;
            default:
              break;
          }
          console.log('Ticket priority:', ticket.priority);
        }
        console.log("high Queue:",highQueue);
      }
        catch{
          console.log("Cannot retrieve tickets");
          console.log("Cannot create queues");
        }
       
      try{
        const agents = await agentModel.find().lean();
        console.log('Agents:', agents);
        // software high, network medium, hardware low
      
        const agent1 = agents.find(agent => agent.name === 'agent1');
        console.log("Agent 1 : ", agent1);
        const agent2 = agents.find(agent => agent.name === 'agent2');
        console.log("Agent 2 : ", agent2);
      
        const agent3 = agents.find(agent => agent.name === 'agent3');
        console.log("Agent 3 : ", agent3);


        console.log(":HDdhdhdh");
        while (
          highQueue.length > 0 ||
          mediumQueue.length > 0 ||
          lowQueue.length > 0 ||
          agent1.ticketCount < 5 ||
          agent2.ticketCount < 5 ||
          agent3.ticketCount < 5
          ) {
            console.log(highQueue.length)
            
            //HIGH QUEUE
            while (highQueue.length>0){
              console.log("yyyy")
              const ticket = highQueue.shift();
              console.log("yyuhhyy")
              console.log("ticket: ", ticket.category);
           
              
              if(ticket.category==='Software'){
              console.log("Agent 1 : ", agent1);
              
               if(agent1.ticketCount < 5){
                  console.log(agent1._id.toString() ,"nedw")
                  const agentid=agent1._id.toString();
                  ticket.agent_id = agentid;
                  console.log(agent1._id.toString());
                  await ticketsModel.findByIdAndUpdate(ticket._id, { agent_id: ticket.agent_id });
                  // await ticket.save(ticket.agent_id);
               }
               else if(agent1.ticketCount > 5&& agent2.ticketCount < 5){
                const agentid=agent2._id.toString();
                ticket.agent_id = agentid;
                console.log(agent2._id.toString());
                await ticketsModel.findByIdAndUpdate(ticket._id, { agent_id: ticket.agent_id });
               }
               else if(agent1.ticketCount > 5&& agent2.ticketCount > 5){
                const agentid=agent3._id.toString();
                  ticket.agent_id = agentid;
                  console.log(agent3._id.toString());
                  await ticketsModel.findByIdAndUpdate(ticket._id, { agent_id: ticket.agent_id });
               }
               else{
                highQueue.push(ticket);
                await sleep(10000000);
               }
              }

            if(ticket.category==='Hardware'){

              if(agent2.ticketCount < 5){
                console.log(agent2._id.toString() ,"nedw")
                const agentid=agent2._id.toString();
                ticket.agent_id = agentid;
                console.log(agent2._id.toString());
                await ticketsModel.findByIdAndUpdate(ticket._id, { agent_id: ticket.agent_id });
                // await ticket.save(ticket.agent_id);
             }
             else if(agent2.ticketCount > 5&& agent3.ticketCount < 5){
              const agentid=agent3._id.toString();
              ticket.agent_id = agentid;
              console.log(agent3._id.toString());
              await ticketsModel.findByIdAndUpdate(ticket._id, { agent_id: ticket.agent_id });
             }
             else if(agent2.ticketCount > 5&& agent3.ticketCount > 5){
              const agentid=agent1._id.toString();
                ticket.agent_id = agentid;
                console.log(agent1._id.toString());
                await ticketsModel.findByIdAndUpdate(ticket._id, { agent_id: ticket.agent_id });
             }
             else{
              highQueue.push(ticket);
              await sleep(10000000);
             }
              }
            if(ticket.category==='Network'){
              if(agent3.ticketCount < 5){
                console.log(agent3._id.toString() ,"nedw")
                const agentid=agent3._id.toString();
                ticket.agent_id = agentid;
                console.log(agent3._id.toString());
                await ticketsModel.findByIdAndUpdate(ticket._id, { agent_id: ticket.agent_id });
                // await ticket.save(ticket.agent_id);
             }
             else if(agent3.ticketCount > 5&& agent1.ticketCount < 5){
              const agentid=agent1._id.toString();
              ticket.agent_id = agentid;
              console.log(agent1._id.toString());
              await ticketsModel.findByIdAndUpdate(ticket._id, { agent_id: ticket.agent_id });
             }
             else if(agent3.ticketCount > 5&& agent1.ticketCount > 5){
              const agentid=agent2._id.toString();
                ticket.agent_id = agentid;
                console.log(agent2._id.toString());
                await ticketsModel.findByIdAndUpdate(ticket._id, { agent_id: ticket.agent_id });
             }
             else{
              highQueue.push(ticket);
              await sleep(10000000);
             }
              }
            }
          
      
      

//MEDIUM QUEUE

while (mediumQueue.length>0){
  console.log("yyyy")
  const ticket = mediumQueue.shift();
  console.log("yyuhhyy")
  console.log("ticket: ", ticket.category);

  
  if(ticket.category==='Software'){
  console.log("Agent 1 : ", agent1);
  
   if(agent1.ticketCount < 5){
      console.log(agent1._id.toString() ,"nedw")
      const agentid=agent1._id.toString();
      ticket.agent_id = agentid;
      console.log(agent1._id.toString());
      await ticketsModel.findByIdAndUpdate(ticket._id, { agent_id: ticket.agent_id });
      // await ticket.save(ticket.agent_id);
   }
   else if(agent1.ticketCount > 5&& agent2.ticketCount < 5){
    const agentid=agent2._id.toString();
    ticket.agent_id = agentid;
    console.log(agent2._id.toString());
    await ticketsModel.findByIdAndUpdate(ticket._id, { agent_id: ticket.agent_id });
   }
   else if(agent1.ticketCount > 5&& agent2.ticketCount > 5){
    const agentid=agent3._id.toString();
      ticket.agent_id = agentid;
      console.log(agent3._id.toString());
      await ticketsModel.findByIdAndUpdate(ticket._id, { agent_id: ticket.agent_id });
   }
   else{
    mediumQueue.push(ticket);
    await sleep(10000000);
   }
  }

if(ticket.category==='Hardware'){

  if(agent2.ticketCount < 5){
    console.log(agent2._id.toString() ,"nedw")
    const agentid=agent2._id.toString();
    ticket.agent_id = agentid;
    console.log(agent2._id.toString());
    await ticketsModel.findByIdAndUpdate(ticket._id, { agent_id: ticket.agent_id });
    // await ticket.save(ticket.agent_id);
 }
 else if(agent2.ticketCount > 5&& agent3.ticketCount < 5){
  const agentid=agent3._id.toString();
  ticket.agent_id = agentid;
  console.log(agent3._id.toString());
  await ticketsModel.findByIdAndUpdate(ticket._id, { agent_id: ticket.agent_id });
 }
 else if(agent2.ticketCount > 5&& agent3.ticketCount > 5){
  const agentid=agent1._id.toString();
    ticket.agent_id = agentid;
    console.log(agent1._id.toString());
    await ticketsModel.findByIdAndUpdate(ticket._id, { agent_id: ticket.agent_id });
 }
 else{
  mediumQueue.push(ticket);
  await sleep(10000000);
 }
  }
if(ticket.category==='Network'){
  if(agent3.ticketCount < 5){
    console.log(agent3._id.toString() ,"nedw")
    const agentid=agent3._id.toString();
    ticket.agent_id = agentid;
    console.log(agent3._id.toString());
    await ticketsModel.findByIdAndUpdate(ticket._id, { agent_id: ticket.agent_id });
    // await ticket.save(ticket.agent_id);
 }
 else if(agent3.ticketCount > 5&& agent1.ticketCount < 5){
  const agentid=agent1._id.toString();
  ticket.agent_id = agentid;
  console.log(agent1._id.toString());
  await ticketsModel.findByIdAndUpdate(ticket._id, { agent_id: ticket.agent_id });
 }
 else if(agent3.ticketCount > 5&& agent1.ticketCount > 5){
  const agentid=agent2._id.toString();
    ticket.agent_id = agentid;
    console.log(agent2._id.toString());
    await ticketsModel.findByIdAndUpdate(ticket._id, { agent_id: ticket.agent_id });
 }
 else{
  mediumQueue.push(ticket);
  await sleep(10000000);
 }
  }
}


        
      
while (lowQueue.length>0){
  console.log("yyyy")
  const ticket = lowQueue.shift();
  console.log("yyuhhyy")
  console.log("ticket: ", ticket.category);

  
  if(ticket.category==='Software'){
  console.log("Agent 1 : ", agent1);
  
   if(agent1.ticketCount < 5){
      console.log(agent1._id.toString() ,"nedw")
      const agentid=agent1._id.toString();
      ticket.agent_id = agentid;
      console.log(agent1._id.toString());
      await ticketsModel.findByIdAndUpdate(ticket._id, { agent_id: ticket.agent_id });
      // await ticket.save(ticket.agent_id);
   }
   else if(agent1.ticketCount > 5&& agent2.ticketCount < 5){
    const agentid=agent2._id.toString();
    ticket.agent_id = agentid;
    console.log(agent2._id.toString());
    await ticketsModel.findByIdAndUpdate(ticket._id, { agent_id: ticket.agent_id });
   }
   else if(agent1.ticketCount > 5&& agent2.ticketCount > 5){
    const agentid=agent3._id.toString();
      ticket.agent_id = agentid;
      console.log(agent3._id.toString());
      await ticketsModel.findByIdAndUpdate(ticket._id, { agent_id: ticket.agent_id });
   }
   else{
    lowQueue.push(ticket);
    await sleep(10000000);
   }
  }

if(ticket.category==='Hardware'){

  if(agent2.ticketCount < 5){
    console.log(agent2._id.toString() ,"nedw")
    const agentid=agent2._id.toString();
    ticket.agent_id = agentid;
    console.log(agent2._id.toString());
    await ticketsModel.findByIdAndUpdate(ticket._id, { agent_id: ticket.agent_id });
    // await ticket.save(ticket.agent_id);
 }
 else if(agent2.ticketCount > 5&& agent3.ticketCount < 5){
  const agentid=agent3._id.toString();
  ticket.agent_id = agentid;
  console.log(agent3._id.toString());
  await ticketsModel.findByIdAndUpdate(ticket._id, { agent_id: ticket.agent_id });
 }
 else if(agent2.ticketCount > 5&& agent3.ticketCount > 5){
  const agentid=agent1._id.toString();
    ticket.agent_id = agentid;
    console.log(agent1._id.toString());
    await ticketsModel.findByIdAndUpdate(ticket._id, { agent_id: ticket.agent_id });
 }
 else{
  lowQueue.push(ticket);
  await sleep(10000000);
 }
  }
if(ticket.category==='Network'){
  if(agent3.ticketCount < 5){
    console.log(agent3._id.toString() ,"nedw")
    const agentid=agent3._id.toString();
    ticket.agent_id = agentid;
    console.log(agent3._id.toString());
    await ticketsModel.findByIdAndUpdate(ticket._id, { agent_id: ticket.agent_id });
    // await ticket.save(ticket.agent_id);
 }
 else if(agent3.ticketCount > 5&& agent1.ticketCount < 5){
  const agentid=agent1._id.toString();
  ticket.agent_id = agentid;
  console.log(agent1._id.toString());
  await ticketsModel.findByIdAndUpdate(ticket._id, { agent_id: ticket.agent_id });
 }
 else if(agent3.ticketCount > 5&& agent1.ticketCount > 5){
  const agentid=agent2._id.toString();
    ticket.agent_id = agentid;
    console.log(agent2._id.toString());
    await ticketsModel.findByIdAndUpdate(ticket._id, { agent_id: ticket.agent_id });
 }
 else{
  lowQueue.push(ticket);
  await sleep(10000000);
 }
  }
}


      
    if (automatedWorkflowController.isEmpty(highQueue)
     &&automatedWorkflowController.isEmpty(mediumQueue)
     && automatedWorkflowController.isEmpty(lowQueue)) 
     {
    break; // Break the loop if all queues are empty
  }
  return res.status(200).send("Agent assigned successfully");

 
      }
    }
catch{
  console.log("Error in handling queues with agents")
} 
}
}


 module.exports = automatedWorkflowController;

 
           