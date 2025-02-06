# Dynamic Form

Mantine UI tabanlı, dinamik form oluşturma komponenti.

## Özellikler

- JSON yapılandırması ile form oluşturma
- Desteklenen alan tipleri:
  - Textbox
  - Textarea  
  - Date
  - Checkbox
  - Dropdown (Bağımlı dropdown desteği)
  - Mask Input
  - Number
  - Switch
  - MultiSelect

## Kurulum

```bash
npm install @mantine/core @mantine/form
npm install git+https://github.com/AIFusion3/DynamicForm
```

## Kullanım

```tsx
import DynamicForm from 'dynamic-form';
const config = {
rows: [
    {
        title: "Kişisel Bilgiler",
        columns: [
            {
                span: 6,
                fields: [
                    {
                    field: "name",
                    title: "Ad",
                    type: "textbox",
                    required: true
                    },
                    {
                    field: "birthDate",
                    title: "Doğum Tarihi",
                    type: "date"
                    }
                ]
            }
        ]
    }
]
};
function App() {
    return (
        <DynamicForm
        config={config}
        baseUrl="https://api.example.com"
        endpoint="users"
        onSuccess={(data) => console.log(data)}
        />
    );
}
```

## Props

| Prop | Tip | Zorunlu | Açıklama |
|------|-----|---------|-----------|
| config | FormConfig | ✓ | Form yapılandırması |
| baseUrl | string | ✓ | API base URL |
| endpoint | string | ✓ | API endpoint |
| initialData | object | | Başlangıç değerleri |
| onSuccess | function | | Başarılı submit callback |
| submitButtonProps | object | | Submit buton özellikleri |
| cancelButtonProps | object | | İptal buton özellikleri |

## Lisans

MIT

