$(function () {
    var from_or_to = 0, valid, from_chainId = 1, to_chainId = 56, from_check = 0, type = 0, blance, network, adderss;
    var contract = new Chain();
    var timer1,timer2;
    $('#prompt_close').on('click', closeprompt);
    $('#addbut').on('click', closeprompt);
    $('#network_close').on('click', close_network);
    $('.fromselect').on('click', openselectfromnetwork);
    $('.toselect').on('click', openselecttonetwork);
    $('.frombtn').on('click', select_from_network);
    $('#approves').on('click', approves);
    $('.connect').on('click', connectWallet);
    $('#claim').on('click', mintDeri);
    $('#sends').on('click', freeze);
    $('.tochain').on('click',select_to_network)
    function select_to_network(){
        let network = $(this).find(' .network .network_text').html();
        if (network == 'BSC') {
            to_chainId = 56;
            $('.to_bsc').show();
            $('.tbsced').show();
            $('.to_heco').hide();
            $('.to_eth').hide();
            $('.tethed').hide();
            $('.thecoed').hide();
        }
        if (network == 'Heco') {
            to_chainId = 128;
            $('.to_heco').show();
            $('.thecoed').show();
            $('.to_bsc').hide();
            $('.to_eth').hide();
            $('.tbsced').hide();
            $('.tethed').hide();
        }
        if (network == 'Ethereum') {
            to_chainId = 1;
            $('.to_heco').hide();
            $('.thecoed').hide();
            $('.to_bsc').hide();
            $('.to_eth').show();
            $('.tbsced').hide();
            $('.tethed').show();
        }
        $('.thAfEGY').show();
        $('.tkQzQQm').hide();
        $('.to_select_network').hide();
        sessionStorage.setItem('toid',to_chainId);
    }
    function select_from_network(){
        let network = $(this).find('.fromchain .network .network_text').html();
        if (network == 'BSC') {
            from_chainId = 56;
            type = 1;
            $('.from_bsc').show();
            $('.fbsced').show();
            $('.from_heco').hide();
            $('.from_eth').hide();
            $('.fethed').hide();
            $('.fhecoed').hide();
        }
        if (network == 'Heco') {
            from_chainId = 128;
            type = 2
            $('.from_heco').show();
            $('.fhecoed').show();
            $('.from_bsc').hide();
            $('.from_eth').hide();
            $('.fbsced').hide();
            $('.fethed').hide();
        }
        if (network == 'Ethereum') {
            from_chainId = 1;
            type = 0;
            $('.from_eth').show();
            $('.fethed').show();
            $('.from_heco').hide();
            $('.from_bsc').hide();
            $('.fhecoed').hide();
            $('.fbsced').hide();
        }
        from_check = 1;
        $('.hAfEGY').show();
        $('.kQzQQm').hide();
        $('.from_select_network').hide();
        sessionStorage.setItem('fromid',from_chainId);
        if (adderss) {
            connectWallet()
        }
    }
    
    function freeze() {
        let amount = $('.c-input').val();
        let button = $('#sends');
        if (from_chainId) {
            if(to_chainId != from_chainId){
                if (amount > 0) {
                    if (+amount <= blance) {
                        if (!valid) {
                            disableButton(button);
                            $('.disable').show();
                            $('.one').show();
                            contract.freeze(amount, to_chainId).then(res => {
                                if (res.success) {
                                    $('.two').show()
                                    connectWallet()
                                    timer1 = setInterval(() => {
                                        connectWallet()
                                    }, 5000);
                                }else{
                                    $('.disable').hide();
                                    enableButton(button)
                                }
                            })
                        } 
                    }else{
                        alert('There is not enough Amount')
                    }
                } else {
                    alert('Amount must be greater than zero')
                }
            }else{
                alert('Please select a different network');
            }

        } else {
            alert('Please select to first')
        }
    }
    
    function mintDeri() {
        let button = $('#claim')
        disableButton(button);
        $('.four').show();
        contract.mintDeri().then((res => {
            if (res.success) {
                $('.five').show();
                contract.initialize(0,type).then(()=>{
                    if(!contract.valid){
                        $('.six').show();
                        enableButton(button);
                        button.attr('disabled',true)
                    }
                })
                timer2 = setInterval(() => {
                    contract.initialize(0,type).then(()=>{
                        if(!contract.valid){
                            $('.six').show();
                            enableButton(button)
                            button.attr('disabled',true)
                        }
                    })
                }, 5000);
            }else{
                
                enableButton(button)
            }
        }))

    }
    function approves() {
        let button = $('#approves');
        if (!adderss) {
            alert('Cannot connect wallet');
            return
        }
        if(!from_chainId){
            alert('Please select From first');
            return;
        }
        disableButton(button);
        contract.unlock().then(res => {
            enableButton(button);
            isapproves();
        }).catch(err => {
            console.log(err)
        })
    }
    function isapproves() {
        contract.isUnlocked().then(res => {
            if (res) {
                $('.send').show()
                $('.approve').hide()
                if (valid) {
                    $('.claiming').show();
                    $('.claim').show();
                    $('.sending').hide();
                    $('.approve').hide();
                    $('.send').hide();
                }
            } else {
                $('.send').hide()
                $('.approve').show()
            }
        }).catch(err => {

        })
    }
    connectWallet();
    function connectWallet() {
        contract.connectWallet().then((res) => {
            if (res.success) {
                contract.initialize(0, type).then(() => {
                    adderss = contract.account
                    let account = contract.account;
                    account = account.slice(0, 6) +
                        "***" +
                        account.slice(account.length - 4, account.length);
                    $('#adderss').text(account);
                    $('.connect').hide();
                    $('#adderssbtn').show();
                    let walletid = ethereum.networkVersion;
                    if(walletid == 1){
                        $('.netlogo').css(
                            "background-image",'url(../img/eth.png)'
                        );
                        $('.nettext').text('ETH');
                    }
                    if(walletid == 56){
                        $('.netlogo').css(
                            "background-image",'url(../img/bsc.png)'
                        );
                        $('.nettext').text('BSC');
                    }
                    if(walletid == 128){
                        $('.netlogo').css(
                            "background-image",'url(../img/heco.png) 100%'
                        );
                        $('.nettext').text('HECO');
                    }
                    valid = contract.valid;
                    getWalletBalance();
                    isapproves();
                    $('.woor').text('')
                    if (valid) {
                        if (contract.fromChainId == '1') {
                            $('.from_eth').show();
                            $('.from_heco').hide();
                            $('.from_bsc').hide();
                            $('.chain').eq(2).hide().siblings().show()
                        }
                        if (contract.fromChainId == '56') {
                            $('.from_bsc').show();
                            $('.from_heco').hide();
                            $('.from_eth').hide();
                            $('.chain').eq(0).hide().siblings().show();
                        }
                        if (contract.fromChainId == '128') {
                            $('.from_heco').show();
                            $('.from_bsc').hide();
                            $('.from_eth').hide();
                            $('.chain').eq(1).hide().siblings().show()
                        }
                        if (contract.toChainId == '1') {
                            type = 0;
                            $('.to_eth').show();
                            $('.to_heco').hide();
                            $('.to_bsc').hide();
                        }
                        if (contract.toChainId == '56') {
                            type = 1;
                            $('.to_eth').hide();
                            $('.to_heco').hide();
                            $('.to_bsc').show();
                        }
                        if (contract.toChainId == '128') {
                            type = 2;
                            $('.to_eth').hide();
                            $('.to_heco').show();
                            $('.to_bsc').hide();
                        }
                        if (ethereum.networkVersion != contract.toChainId) {
                            if (contract.toChainId == '1') {
                                text = 'Ethereum';
                            }
                            if (contract.toChainId == '56') {
                                text = 'BSC'
                            }
                            if (contract.toChainId == '128') {
                                text = 'HECO'
                            }
                            let woor = `Please connect to ${text}`;
                            $('#claim').attr("disabled", true);
                            $('#approves').attr("disabled", true);
                            $('.woor').text(woor)
                        } else {
                            $('#claim').attr("disabled", false);
                            $('#approves').attr("disabled", false);
                            $('.woor').text('')
                        }
                        contract.initialize(0, type).then((res) => {
                            getWalletBalance();
                            if (valid) {
                                $('.claiming').show();
                                $('.claim').show();
                                $('.sending').hide();
                                $('.approve').hide();
                                $('.send').hide();
                                $('.amounted').text(contract.amount)
                            }
                        })
                        $('.disable').show();
                        from_chainId = contract.fromChainId;
                        to_chainId = contract.toChainId;
                        let to_network;
                        let from_etwork;
                        if(to_chainId == '1'){
                            to_network = 'Ethereum'
                        }
                        if(to_chainId == '56'){
                            to_network = 'BSC'
                        }
                        if(to_chainId == '128'){
                            to_network = 'Heco'
                        }
                        if(from_chainId == '1'){
                            from_etwork = 'Ethereum'
                        }
                        if(from_chainId == '56'){
                            from_etwork = 'BSC'
                        }
                        if(from_chainId == '128'){
                            from_etwork = 'Heco'
                        }
                        $('.one').show();
                        $('.two').show();
                        $('.three').show();
                        $('.info_tonetwork').text(to_network);
                        $('.info_fromnetwork').text(from_etwork);
                        return;
                    }

                    let lstoid = sessionStorage.getItem('toid')
                    if(lstoid){
                        to_chainId = lstoid;
                        if (to_chainId == '56') {
                            $('.to_bsc').show();
                            $('.to_heco').hide();
                            $('.to_eth').hide();
                            $('.tbsced').show();
                            $('.thecoed').hide();
                            $('.tethed').hide();
                        }
                        if (to_chainId == '128') {
                            $('.to_heco').show();
                            $('.to_bsc').hide();
                            $('.to_eth').hide();
                            $('.tbsced').hide();
                            $('.thecoed').show();
                            $('.tethed').hide();
                        }
                        if (to_chainId == '1') {
                            $('.to_eth').show();
                            $('.to_heco').hide();
                            $('.to_bsc').hide();
                            $('.tbsced').hide();
                            $('.thecoed').hide();
                            $('.tethed').show();
                        }
                    }
                    let lsfromid = sessionStorage.getItem('fromid')
                    if(lsfromid){
                        from_chainId = lsfromid;
                        if (from_chainId == '56') {
                            type = 1;
                            $('.from_bsc').show();
                            $('.from_heco').hide();
                            $('.from_eth').hide();
                            $('.fbsced').show();
                            $('.fhecoed').hide();
                            $('.fethed').hide();
                        }
                        if (from_chainId == '128') {
                            type = 2
                            $('.from_heco').show();
                            $('.from_bsc').hide();
                            $('.from_eth').hide();
                            $('.fbsced').hide();
                            $('.fhecoed').show();
                            $('.fethed').hide();
                        }
                        if (from_chainId == '1') {
                            type = 0;
                            $('.from_eth').show();
                            $('.from_heco').hide();
                            $('.from_bsc').hide();
                            $('.fbsced').hide();
                            $('.fhecoed').hide();
                            $('.fethed').show();
                        }
                        from_check = 1;
                        if (ethereum.networkVersion != from_chainId) {
                            let network = from_chainId
                            let text;
                            if (network == '1') {
                                text = 'Ethereum';
                            }
                            if (network == '56') {
                                text = 'BSC'
                            }
                            if (network == '128') {
                                text = 'HECO'
                            }
                            let woor = `Please connect to ${text}`
                            $('.woor').text(woor)
                            $('#approves').attr("disabled", true);
                            $('.balance').text('--')
                            return;
                        }
                        contract.initialize(0,type).then(res=>{
                            getWalletBalance();
                            isapproves();
                        })
                        $('#claim').attr("disabled", false);
                        $('#approves').attr("disabled", false);
                        return;
                    }
                    if(from_chainId){
                        if (ethereum.networkVersion != from_chainId) {
                            let network = from_chainId
                            let text;
                            if (network == '1') {
                                text = 'Ethereum';
                            }
                            if (network == '56') {
                                text = 'BSC'
                            }
                            if (network == '128') {
                                text = 'HECO'
                            }
                            let woor = `Please connect to ${text}`
                            $('.woor').text(woor)
                            $('#approves').attr("disabled", true);
                            $('.balance').text('--')
                            return;
                        }
                    }
                    
                })
            } else {
                alert('Cannot connect wallet')
            }
        })
    }
    function getWalletBalance() {
        contract.getWalletBalance().then((res) => {
            blance = res;
            $('.balance').text(blance)
        })
    }
    function closeprompt() {
        $('.prompt').hide();
    }
    function close_network() {
        $('.select_network').hide();
    }
    function openselectfromnetwork() {
        if($('.kQzQQm').css("display") == 'none'){
            $('.hAfEGY').hide();
            $('.kQzQQm').show();
            $('.thAfEGY').show();
            $('.tkQzQQm').hide();
            $('.from_select_network').show();
            $('.to_select_network').hide();
        }else{
            $('.hAfEGY').show();
            $('.kQzQQm').hide();
            $('.from_select_network').hide()
        }
        
        
    }
    function openselecttonetwork(){
        if($('.tkQzQQm').css("display") == 'none'){
            $('.thAfEGY').hide();
            $('.tkQzQQm').show();
            $('.hAfEGY').show();
            $('.kQzQQm').hide();
            $('.from_select_network').hide();
            $('.to_select_network').show();
        }else{
            $('.thAfEGY').show();
            $('.tkQzQQm').hide();
            $('.to_select_network').hide();
        }
    }
    function disableButton(button) {
        button.find("span.spinner").show();
        button.attr("disabled", true);
    }
    function enableButton(button) {
        button.find("span.spinner").hide();
        button.attr("disabled", false);
    }
})