--- Techops Unsocial Hours Calculator ---

This is a small webapp / tool to calculate unsocial hours claims. 

It was mostly created as a project for my own benefit particularly as Nick has already created a similar tool.

At the moment my tools suffers similar limitations to his, as it doesn't split shifts running over the start / end of months and currently adds these as a full shift for the current month.

--- So why use this tool? ---

Well if you're already happy with Nick's tool obviously feel free to keep using it, it's great work, I just did this as a learning project. 

Although one benefit is that this just runs in your browser so won't trigger any security warnings on corporate devices.

In the future I hope to have bank holidays automatically calculated and have the file manipulate the actual unsocial hours form.

--- Instructions ---

-Select your team to generate the table.
-Click on the "EXPORT REPORT" button to export as excel file
-You will need to manually copy over the data to your unsocial hours claim form for the month

IMPORTANT! It's your responsibility to make sure the data is correct, this tool is in beta and may still have unforeseen bugs!</p>

--- Current Limitations / known bugs: ---

-If you select the wrong team REFRESH the page to clear the table, it will use the first one you click
-You can copy / paste the exported table data straight into the OT form, but you'll want to manually replace the numbers for the hours as the exported numbers aren't considered integers and the sums at the bottom of the form won't work. 
-The tool will calculate date using only the date the shift started, if you don't want to claim the full 11 hours on a night shift you begin on the final day of the month you'll need to edit this manually.
-Bank holidays need to be added manually.
-If your shift occurs during a Daylight Savings time change I haven't coded anything for that, so I don't know what, if anything, will happen.
      
--- Bug reports: ---

Please email mike.mockler@nhs.net and include 'UnsocialCalc' in the subject heading.
