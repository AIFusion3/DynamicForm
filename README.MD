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

| Prop | Tip | Açıklama |
|------|-----|----------|
| config | FormConfig | Form yapılandırması |
| baseUrl | string | API base URL |
| endpoint | string | API endpoint |
| initialData | object | Başlangıç değerleri |
| onSuccess | function | Başarılı form gönderimi callback'i |
| submitButtonProps | object | Kaydet butonu özellikleri |
| cancelButtonProps | object | İptal butonu özellikleri |
| useToken | boolean | Token kullanımı (default: false) |
| showDebug | boolean | Debug modu (default: false) |


## Field Tipleri ve Özellikleri

### Ortak Özellikler
- field: Alan adı
- title: Etiket
- type: Alan tipi
- required: Zorunlu alan
- placeholder: Placeholder metni

### Özel Özellikler

#### Textarea
- minRows: Minimum satır
- maxRows: Maksimum satır
- autosize: Otomatik boyutlandırma

#### Dropdown
- optionsUrl: Seçenekler için API URL
- options: Statik seçenekler
- refField: Bağımlı olduğu alan

#### Number
- min: Minimum değer
- max: Maksimum değer
- step: Artış miktarı
- prefix: Önek
- suffix: Sonek
- defaultValue: Varsayılan değer
- decimalSeparator: Ondalık ayracı
- thousandSeparator: Binlik ayracı

#### MaskInput
- mask: Maske paterni

#### Switch
- defaultChecked: Varsayılan durum

## Token Kullanımı

Token kullanımı için:
1. useToken prop'unu true olarak ayarlayın
2. localStorage'da 'token' anahtarıyla JWT token'ı saklayın

Token otomatik olarak API isteklerine Bearer token olarak eklenecektir.

## Lisans

MIT

