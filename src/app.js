App = {
    loading: false,
    contracts: {},
  
    load: async () => {
      await App.loadWeb3()
      await App.loadAccount()
      await App.loadContract()
      await App.render()
    },
  
    // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
    loadWeb3: async () => {
      if (typeof web3 !== 'undefined') {
        App.web3Provider = web3.currentProvider
        web3 = new Web3(web3.currentProvider)
      } else {
        window.alert("Please connect to Metamask.")
      }
      // Modern dapp browsers...
      if (window.ethereum) {
        window.web3 = new Web3(ethereum)
        try {
          // Request account access if needed
          await ethereum.enable()
          // Acccounts now exposed
          web3.eth.sendTransaction({/* ... */})
        } catch (error) {
          // User denied account access...
        }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        App.web3Provider = web3.currentProvider
        window.web3 = new Web3(web3.currentProvider)
        // Acccounts always exposed
        web3.eth.sendTransaction({/* ... */})
      }
      // Non-dapp browsers...
      else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
      }
    },
  
    loadAccount: async () => {
      // Set the current blockchain account
      App.account = web3.eth.accounts[0]
    },
  
    loadContract: async () => {
      // Create a JavaScript version of the smart contract
      const landrecords = await $.getJSON('LandRecords.json')
      App.contracts.LandRecords = TruffleContract(landrecords)
      App.contracts.LandRecords.setProvider(App.web3Provider)
  
      // Hydrate the smart contract with values from the blockchain
      App.landrecords = await App.contracts.LandRecords.deployed()
    },
  
    render: async () => {
      // Prevent double render
      if (App.loading) {
        return
      }
  
      // Update app loading state
      App.setLoading(true)
  
      // Render Account
      $('#account').html(App.account)
  
      
      // Update loading state
      App.setLoading(false)
    },
  
    
    setLoading: (boolean) => {
      App.loading = boolean
      const loader = $('#loader')
      const content = $('#content')
      if (boolean) {
        loader.show()
        content.hide()
      } else {
        loader.hide()
        content.show()
      }
    },

    createRecord: async () => {
      App.setLoading(true)
      const cid = $('#Cid').val()
      const owner = $('#Owner').val()
      const addr = $('#Address').val()
      const sqf = $('#sqfeet').val()

      
      await App.landrecords.createRecord(parseInt(cid),String(owner),String(addr),parseInt(sqf))
      window.location.reload()
    },

    view: async () => {
      App.setLoading(true)
      const cid = $('#Cid').val()
      var intcid = parseInt(cid)
      var recordCount = await App.landrecords.recordCount()
      recordCount = recordCount.toNumber()
      
      $('#test3').html("Number of Records:"+recordCount+"<br><br>")

      for (var i = 1; i <= recordCount; i++) {
        const record = await App.landrecords.records(i)
        var rid = record[0].toNumber()
        var cid1 = record[1].toNumber()
        var owner = record[2]
        var addr = record[3]
        var sq = record[4].toNumber()
        var lid = record[5].toNumber()

        $('#test3').append("<h3> <strong>Record id:"+rid+"</strong><br></h3>")
        $('#test3').append("<h3> Citizen id:"+cid1+"<br></h3>")
        $('#test3').append("<h3> Owner name:"+owner+"<br></h3>")
        $('#test3').append("<h3> address:"+addr+"<br></h3>")
        $('#test3').append("<h3> Sq feet:"+sq+"<br></h3>")
        $('#test3').append("<h3> Land id:"+lid+"<br><br><br></h3>")
         }
      
       },

       search: async () => {
        App.setLoading(true)
        const cid = $('#Cid').val()
        var intcid = parseInt(cid)
        var recordCount = await App.landrecords.recordCount()
        recordCount = recordCount.toNumber()
        
        
  
        for (var i = 1; i <= recordCount; i++) {
          const record = await App.landrecords.records(i)
          var rid = record[0].toNumber()
          var cid1 = record[1].toNumber()
          var owner = record[2]
          var addr = record[3]
          var sq = record[4].toNumber()
          var lid = record[5].toNumber()


          if(cid1==intcid){
          $('#test3').html("<strong>Record Found</strong><br><br>")
          $('#test3').append("<h3> <strong>Record id:"+rid+"</strong><br></h3>")
          $('#test3').append("<h3> Citizen id:"+cid1+"<br></h3>")
          $('#test3').append("<h3> Owner name:"+owner+"<br></h3>")
          $('#test3').append("<h3> address:"+addr+"<br></h3>")
          $('#test3').append("<h3> Sq feet:"+sq+"<br></h3>")
          $('#test3').append("<h3> Land id:"+lid+"<br><br><br></h3>")
          }

           }
        
         }


  }
  
  $(() => {
    $(window).load(() => {
      App.load()
    })
  })