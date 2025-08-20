import{j as e}from"./jsx-runtime-C_nHp4yK.js";import{B as n}from"./Button-Z4hbXct5.js";import"./iframe-D_aMTKb2.js";import"./preload-helper-DIZFD4sK.js";const u={title:"Components/Button",component:n,parameters:{layout:"centered",docs:{description:{component:"A versatile button component with multiple variants, sizes, and states. Can render as a button or link with full accessibility support. Includes focus states with keyboard navigation - use Tab key to test focus indicators."}}},argTypes:{variant:{control:{type:"select"},options:["default","secondary","primary","outlined","dark","inverse"],description:"The visual style variant of the button"},size:{control:{type:"select"},options:["xsmall","small","medium","large","xlarge"],description:"The size of the button"},disabled:{control:{type:"boolean"},description:"Whether the button is disabled"},href:{control:{type:"text"},description:"If provided, renders as a link instead of a button"},onClick:{action:"clicked"}},tags:["autodocs"]},t={args:{children:"Button"}},s={args:{children:"Button",size:"large"},render:a=>e.jsx("div",{className:"space-y-4",children:e.jsxs("div",{className:"space-x-4",children:[e.jsx(n,{...a,variant:"default",children:"Default"}),e.jsx(n,{...a,variant:"secondary",children:"Secondary"}),e.jsx(n,{...a,variant:"primary",children:"Primary"}),e.jsx(n,{...a,variant:"outlined",children:"Outlined"}),e.jsx(n,{...a,variant:"dark",children:"Dark"}),e.jsx(n,{...a,variant:"inverse",children:"Inverse"})]})}),parameters:{docs:{description:{story:"Different visual variants of the button component."}}}},i={args:{children:"Button",variant:"default"},render:a=>e.jsx("div",{className:"space-y-4",children:e.jsxs("div",{className:"space-x-4",children:[e.jsx(n,{...a,size:"xsmall",children:"XSmall"}),e.jsx(n,{...a,size:"small",children:"Small"}),e.jsx(n,{...a,size:"medium",children:"Medium"}),e.jsx(n,{...a,size:"large",children:"Large"}),e.jsx(n,{...a,size:"xlarge",children:"XLarge"})]})}),parameters:{docs:{description:{story:"Different sizes available for the button component."}}}},r={args:{children:"Button",size:"large",variant:"default"},render:a=>e.jsx("div",{className:"space-y-4",children:e.jsxs("div",{className:"space-x-4",children:[e.jsx(n,{...a,children:"Normal"}),e.jsx(n,{...a,disabled:!0,children:"Disabled"})]})}),parameters:{docs:{description:{story:"Different states of the button component."}}}},l={args:{},render:()=>e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"text-white font-semibold mb-3",children:"Default Variant"}),e.jsxs("div",{className:"space-x-4",children:[e.jsx(n,{size:"xsmall",children:"XSmall"}),e.jsx(n,{size:"small",children:"Small"}),e.jsx(n,{size:"medium",children:"Medium"}),e.jsx(n,{size:"large",children:"Large"}),e.jsx(n,{size:"xlarge",children:"XLarge"})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-white font-semibold mb-3",children:"Secondary Variant"}),e.jsxs("div",{className:"space-x-4",children:[e.jsx(n,{variant:"secondary",size:"xsmall",children:"XSmall"}),e.jsx(n,{variant:"secondary",size:"small",children:"Small"}),e.jsx(n,{variant:"secondary",size:"medium",children:"Medium"}),e.jsx(n,{variant:"secondary",size:"large",children:"Large"}),e.jsx(n,{variant:"secondary",size:"xlarge",children:"XLarge"})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-white font-semibold mb-3",children:"Primary Variant"}),e.jsxs("div",{className:"space-x-4",children:[e.jsx(n,{variant:"primary",size:"xsmall",children:"XSmall"}),e.jsx(n,{variant:"primary",size:"small",children:"Small"}),e.jsx(n,{variant:"primary",size:"medium",children:"Medium"}),e.jsx(n,{variant:"primary",size:"large",children:"Large"}),e.jsx(n,{variant:"primary",size:"xlarge",children:"XLarge"})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-white font-semibold mb-3",children:"Outlined Variant"}),e.jsxs("div",{className:"space-x-4",children:[e.jsx(n,{variant:"outlined",size:"xsmall",children:"XSmall"}),e.jsx(n,{variant:"outlined",size:"small",children:"Small"}),e.jsx(n,{variant:"outlined",size:"medium",children:"Medium"}),e.jsx(n,{variant:"outlined",size:"large",children:"Large"}),e.jsx(n,{variant:"outlined",size:"xlarge",children:"XLarge"})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-white font-semibold mb-3",children:"Dark Variant"}),e.jsxs("div",{className:"space-x-4",children:[e.jsx(n,{variant:"dark",size:"xsmall",children:"XSmall"}),e.jsx(n,{variant:"dark",size:"small",children:"Small"}),e.jsx(n,{variant:"dark",size:"medium",children:"Medium"}),e.jsx(n,{variant:"dark",size:"large",children:"Large"}),e.jsx(n,{variant:"dark",size:"xlarge",children:"XLarge"})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-white font-semibold mb-3",children:"Inverse Variant"}),e.jsxs("div",{className:"space-x-4",children:[e.jsx(n,{variant:"inverse",size:"xsmall",children:"XSmall"}),e.jsx(n,{variant:"inverse",size:"small",children:"Small"}),e.jsx(n,{variant:"inverse",size:"medium",children:"Medium"}),e.jsx(n,{variant:"inverse",size:"large",children:"Large"}),e.jsx(n,{variant:"inverse",size:"xlarge",children:"XLarge"})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-white font-semibold mb-3",children:"Disabled States"}),e.jsxs("div",{className:"space-x-4",children:[e.jsx(n,{size:"large",disabled:!0,children:"Default Disabled"}),e.jsx(n,{variant:"secondary",size:"large",disabled:!0,children:"Secondary Disabled"}),e.jsx(n,{variant:"primary",size:"large",disabled:!0,children:"Primary Disabled"}),e.jsx(n,{variant:"outlined",size:"large",disabled:!0,children:"Outlined Disabled"}),e.jsx(n,{variant:"dark",size:"large",disabled:!0,children:"Dark Disabled"}),e.jsx(n,{variant:"inverse",size:"large",disabled:!0,children:"Inverse Disabled"})]})]})]}),parameters:{docs:{description:{story:"Complete overview of all button variants, sizes, and states."}}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    children: "Button"
  }
}`,...t.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    children: "Button",
    size: "large"
  },
  render: args => <div className="space-y-4">
      <div className="space-x-4">
        <Button {...args} variant="default">
          Default
        </Button>
        <Button {...args} variant="secondary">
          Secondary
        </Button>
        <Button {...args} variant="primary">
          Primary
        </Button>
        <Button {...args} variant="outlined">
          Outlined
        </Button>
        <Button {...args} variant="dark">
          Dark
        </Button>
        <Button {...args} variant="inverse">
          Inverse
        </Button>
      </div>
    </div>,
  parameters: {
    docs: {
      description: {
        story: "Different visual variants of the button component."
      }
    }
  }
}`,...s.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    children: "Button",
    variant: "default"
  },
  render: args => <div className="space-y-4">
      <div className="space-x-4">
        <Button {...args} size="xsmall">
          XSmall
        </Button>
        <Button {...args} size="small">
          Small
        </Button>
        <Button {...args} size="medium">
          Medium
        </Button>
        <Button {...args} size="large">
          Large
        </Button>
        <Button {...args} size="xlarge">
          XLarge
        </Button>
      </div>
    </div>,
  parameters: {
    docs: {
      description: {
        story: "Different sizes available for the button component."
      }
    }
  }
}`,...i.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    children: "Button",
    size: "large",
    variant: "default"
  },
  render: args => <div className="space-y-4">
      <div className="space-x-4">
        <Button {...args}>Normal</Button>
        <Button {...args} disabled>
          Disabled
        </Button>
      </div>
    </div>,
  parameters: {
    docs: {
      description: {
        story: "Different states of the button component."
      }
    }
  }
}`,...r.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {},
  render: () => <div className="space-y-6">
      <div>
        <h3 className="text-white font-semibold mb-3">Default Variant</h3>
        <div className="space-x-4">
          <Button size="xsmall">XSmall</Button>
          <Button size="small">Small</Button>
          <Button size="medium">Medium</Button>
          <Button size="large">Large</Button>
          <Button size="xlarge">XLarge</Button>
        </div>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3">Secondary Variant</h3>
        <div className="space-x-4">
          <Button variant="secondary" size="xsmall">
            XSmall
          </Button>
          <Button variant="secondary" size="small">
            Small
          </Button>
          <Button variant="secondary" size="medium">
            Medium
          </Button>
          <Button variant="secondary" size="large">
            Large
          </Button>
          <Button variant="secondary" size="xlarge">
            XLarge
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3">Primary Variant</h3>
        <div className="space-x-4">
          <Button variant="primary" size="xsmall">
            XSmall
          </Button>
          <Button variant="primary" size="small">
            Small
          </Button>
          <Button variant="primary" size="medium">
            Medium
          </Button>
          <Button variant="primary" size="large">
            Large
          </Button>
          <Button variant="primary" size="xlarge">
            XLarge
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3">Outlined Variant</h3>
        <div className="space-x-4">
          <Button variant="outlined" size="xsmall">
            XSmall
          </Button>
          <Button variant="outlined" size="small">
            Small
          </Button>
          <Button variant="outlined" size="medium">
            Medium
          </Button>
          <Button variant="outlined" size="large">
            Large
          </Button>
          <Button variant="outlined" size="xlarge">
            XLarge
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3">Dark Variant</h3>
        <div className="space-x-4">
          <Button variant="dark" size="xsmall">
            XSmall
          </Button>
          <Button variant="dark" size="small">
            Small
          </Button>
          <Button variant="dark" size="medium">
            Medium
          </Button>
          <Button variant="dark" size="large">
            Large
          </Button>
          <Button variant="dark" size="xlarge">
            XLarge
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3">Inverse Variant</h3>
        <div className="space-x-4">
          <Button variant="inverse" size="xsmall">
            XSmall
          </Button>
          <Button variant="inverse" size="small">
            Small
          </Button>
          <Button variant="inverse" size="medium">
            Medium
          </Button>
          <Button variant="inverse" size="large">
            Large
          </Button>
          <Button variant="inverse" size="xlarge">
            XLarge
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3">Disabled States</h3>
        <div className="space-x-4">
          <Button size="large" disabled>
            Default Disabled
          </Button>
          <Button variant="secondary" size="large" disabled>
            Secondary Disabled
          </Button>
          <Button variant="primary" size="large" disabled>
            Primary Disabled
          </Button>
          <Button variant="outlined" size="large" disabled>
            Outlined Disabled
          </Button>
          <Button variant="dark" size="large" disabled>
            Dark Disabled
          </Button>
          <Button variant="inverse" size="large" disabled>
            Inverse Disabled
          </Button>
        </div>
      </div>
    </div>,
  parameters: {
    docs: {
      description: {
        story: "Complete overview of all button variants, sizes, and states."
      }
    }
  }
}`,...l.parameters?.docs?.source}}};const v=["Default","Variants","Sizes","States","AllVariants"];export{l as AllVariants,t as Default,i as Sizes,r as States,s as Variants,v as __namedExportsOrder,u as default};
