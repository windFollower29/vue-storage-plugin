<template>
<div>

  <table>
    <tr>
      <th>type</th>
      <th>key</th>
      <th>value</th>
      <th>action</th>
    </tr>

    <tr>
      <td>String</td>
      <td>string</td>
      <td>{{ $storage.string }}</td>
      <td>
        <button @click="$storager.remove('string')">delete 'string' field</button>
      </td>
    </tr>

    <tr>
      <td>Boolean</td>
      <td>boolean</td>
      <td>{{ $storage.boolean }}</td>
      <td>
        <button @click="$storager.remove('boolean')">delete 'boolean' field</button>
      </td>
    </tr>

    <tr>
      <td>Number</td>
      <td>number</td>
      <td>{{ $storage.number }}</td>
      <td>
        <button @click="$storager.remove('number')">delete 'number' field</button>
      </td>
    </tr>

    <tr>
      <td>Array</td>
      <td>array</td>
      <td>{{ $storage.array }}</td>
      <td>
        <button @click="$storager.remove('array')">delete 'array' field</button>
      </td>
    </tr>

    <tr>
      <td>Object</td>
      <td>object</td>
      <td>{{ $storage.object }}</td>
      <td>
        <button @click="$storager.remove('object')">delete 'object' field</button>
      </td>
    </tr>

    <tr>
      <td>Object</td>
      <td>object</td>
      <td v-html="cObj">{{ cObj }}</td>
    </tr>

  </table>

</div>
</template>

<script>
export default {

  computed: {
    cObj () {
      return `a: ${this.$storage.object.a}<br />
      b: ${this.$storage.object.b}`
    }
  },

  mounted () {
    window.$app = this
  },
}
</script>