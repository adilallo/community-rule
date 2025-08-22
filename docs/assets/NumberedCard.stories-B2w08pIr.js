import{j as e}from"./jsx-runtime-C_nHp4yK.js";import{N as o}from"./NumberedCard-ClCynPua.js";import"./iframe-D_aMTKb2.js";import"./preload-helper-DIZFD4sK.js";import"./SectionNumber-Cptefv18.js";const m={title:"Components/NumberedCard",component:o,parameters:{layout:"centered",docs:{description:{component:"Individual numbered card component that displays a step in a process with a numbered icon and descriptive text. Supports responsive layouts across different breakpoints."}}},argTypes:{number:{control:{type:"number",min:1,max:9},description:"The number to display on the card"},text:{control:{type:"text"},description:"The descriptive text for this step"},iconShape:{control:{type:"select"},options:["blob","gear","star"],description:"The shape of the icon background (currently not used, uses PNG images)"},iconColor:{control:{type:"select"},options:["green","purple","orange","blue"],description:"The color theme for the icon (currently not used, uses PNG images)"}},tags:["autodocs"]},t={args:{number:1,text:"Document how your community makes decisions",iconShape:"blob",iconColor:"green"}},r={args:{number:1,text:"Example card text",iconShape:"blob",iconColor:"green"},render:s=>e.jsxs("div",{className:"space-y-4",children:[e.jsx(o,{...s,number:1,text:"First step in the process"}),e.jsx(o,{...s,number:2,text:"Second step with different content"}),e.jsx(o,{...s,number:3,text:"Third and final step of the workflow"})]}),parameters:{docs:{description:{story:"Shows all three numbered cards with different content to demonstrate the visual hierarchy."}}}},n={args:{number:1,text:"This is a much longer piece of text that demonstrates how the card handles content that spans multiple lines and requires more space to display properly",iconShape:"blob",iconColor:"green"},parameters:{docs:{description:{story:"Demonstrates how the card handles longer text content across different breakpoints."}}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    number: 1,
    text: "Document how your community makes decisions",
    iconShape: "blob",
    iconColor: "green"
  }
}`,...t.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    number: 1,
    text: "Example card text",
    iconShape: "blob",
    iconColor: "green"
  },
  render: args => <div className="space-y-4">
      <NumberedCard {...args} number={1} text="First step in the process" />
      <NumberedCard {...args} number={2} text="Second step with different content" />
      <NumberedCard {...args} number={3} text="Third and final step of the workflow" />
    </div>,
  parameters: {
    docs: {
      description: {
        story: "Shows all three numbered cards with different content to demonstrate the visual hierarchy."
      }
    }
  }
}`,...r.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    number: 1,
    text: "This is a much longer piece of text that demonstrates how the card handles content that spans multiple lines and requires more space to display properly",
    iconShape: "blob",
    iconColor: "green"
  },
  parameters: {
    docs: {
      description: {
        story: "Demonstrates how the card handles longer text content across different breakpoints."
      }
    }
  }
}`,...n.parameters?.docs?.source}}};const l=["Default","AllNumbers","LongText"];export{r as AllNumbers,t as Default,n as LongText,l as __namedExportsOrder,m as default};
