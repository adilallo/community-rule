import{j as e}from"./jsx-runtime-C_nHp4yK.js";import{S as r}from"./SectionNumber-Cptefv18.js";import"./iframe-D_aMTKb2.js";import"./preload-helper-DIZFD4sK.js";const u={title:"Components/SectionNumber",component:r,parameters:{layout:"centered",docs:{description:{component:"A numbered icon component that displays a number overlaid on a PNG background image. The component uses different PNG images for numbers 1, 2, and 3, with the image extending beyond the 40px container size."}}},argTypes:{number:{control:{type:"number",min:1,max:3},description:"The number to display (1, 2, or 3)"}},tags:["autodocs"]},n={args:{number:1}},s={args:{number:2}},o={args:{number:3}},a={render:()=>e.jsxs("div",{className:"flex space-x-4",children:[e.jsx(r,{number:1}),e.jsx(r,{number:2}),e.jsx(r,{number:3})]}),parameters:{docs:{description:{story:"Shows all three numbered icons side by side to demonstrate the different PNG backgrounds."}}}},t={render:()=>e.jsx("div",{className:"bg-gray-100 p-8 rounded-lg",children:e.jsxs("div",{className:"flex space-x-4",children:[e.jsx(r,{number:1}),e.jsx(r,{number:2}),e.jsx(r,{number:3})]})}),parameters:{docs:{description:{story:"Shows the numbered icons on a background to demonstrate how the PNG images extend beyond the container."}}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    number: 1
  }
}`,...n.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    number: 2
  }
}`,...s.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    number: 3
  }
}`,...o.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex space-x-4">
      <SectionNumber number={1} />
      <SectionNumber number={2} />
      <SectionNumber number={3} />
    </div>,
  parameters: {
    docs: {
      description: {
        story: "Shows all three numbered icons side by side to demonstrate the different PNG backgrounds."
      }
    }
  }
}`,...a.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => <div className="bg-gray-100 p-8 rounded-lg">
      <div className="flex space-x-4">
        <SectionNumber number={1} />
        <SectionNumber number={2} />
        <SectionNumber number={3} />
      </div>
    </div>,
  parameters: {
    docs: {
      description: {
        story: "Shows the numbered icons on a background to demonstrate how the PNG images extend beyond the container."
      }
    }
  }
}`,...t.parameters?.docs?.source}}};const b=["NumberOne","NumberTwo","NumberThree","AllNumbers","WithBackground"];export{a as AllNumbers,n as NumberOne,o as NumberThree,s as NumberTwo,t as WithBackground,b as __namedExportsOrder,u as default};
