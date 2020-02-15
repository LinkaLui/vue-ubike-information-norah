var vm = new Vue({
  el: '#app',
  data: {
    ubikeStops: [],
    areaChoose: [],
    searchInput: "",
    searchResult: [],
    filterResult: [],
    selectedValue: 25,
    selectedSort: "",
    curPage: 1
  },
  filters: {
    timeFormat(t) {

      var date = [], time = [];

      date.push(t.substr(0, 4));
      date.push(t.substr(4, 2));
      date.push(t.substr(6, 2));
      time.push(t.substr(8, 2));
      time.push(t.substr(10, 2));
      time.push(t.substr(12, 2));

      return date.join("/") + ' ' + time.join(":");
    }
  },
  created() {

    // 欄位說明請參照:
    // http://data.taipei/opendata/datalist/datasetMeta?oid=8ef1626a-892a-4218-8344-f7ac46e1aa48

    // sno：站點代號、 sna：場站名稱(中文)、 tot：場站總停車格、
    // sbi：場站目前車輛數量、 sarea：場站區域(中文)、 mday：資料更新時間、
    // lat：緯度、 lng：經度、 ar：地(中文)、 sareaen：場站區域(英文)、
    // snaen：場站名稱(英文)、 aren：地址(英文)、 bemp：空位數量、 act：全站禁用狀態

    axios.get('https://tcgbusfs.blob.core.windows.net/blobyoubike/YouBikeTP.gz')
      .then(res => {

        // 將 json 轉陣列後存入 this.ubikeStops
        this.ubikeStops = Object.keys(res.data.retVal).map(key => res.data.retVal[key]);
        this.searchResult = this.ubikeStops;
        this.filterResult = this.searchResult;
      });
  },
  computed: {
    areaInfo() {
      let areas = [];
      for (let i = 0; i < this.ubikeStops.length; i++) {
        if (!(areas.indexOf(this.ubikeStops[i].sarea) >= 0)) {
          areas.push(this.ubikeStops[i].sarea);
        }
      }
      return areas;
    },
    sum() {
      return Math.ceil(this.filterResult.length / (this.selectedValue));
    },
    beginItem() {
      return (this.curPage - 1) * (this.selectedValue);
    },
    endItem() {
      return (this.curPage) * (this.selectedValue);
    },
    preShow() {
      return this.curPage == 1 ? false : true;

    },
    nextShow() {
      return this.curPage == this.sum ? false : true;

    }
  },
  watch: {
    selectedSort() {
      this.sort();
    },
    areaChoose() {
      this.areaFilter();
    },
    searchResult() {
      this.areaFilter();
    }
  },
  methods: {
    search() {
      if (this.searchInput != "") {
        this.searchResult = this.ubikeStops.filter(function (ubikeStop) {
          return ubikeStop.sna.indexOf(vm.searchInput) >= 0 ? true : false;
        });
      } else {
        this.searchResult = this.ubikeStops;
      }
    },
    areaFilter() {
      if (this.areaChoose.length > 0) {
        this.filterResult = this.searchResult.filter(function (ubikeStop) {
          for (let i = 0; i < vm.areaChoose.length; i++) {
            if (ubikeStop.sarea.match(vm.areaChoose[i])) {
              return true;
            }
          }
          return false;
        });
      } else {
        this.filterResult = this.searchResult;
      }
    },
    sort() {
      switch (this.selectedSort) {
        case 'snoAsc':
          sort = this.filterResult.sort(function (a, b) {
            return parseInt(a.sno) > parseInt(b.sno) ? 1 : -1;
          });
          break;
        case 'snoDesc':
          sort = this.filterResult.sort(function (a, b) {
            return parseInt(a.sno) < parseInt(b.sno) ? 1 : -1;
          });
          break;
        case 'sbiAsc':
          sort = this.filterResult.sort(function (a, b) {
            return parseInt(a.sbi) > parseInt(b.sbi) ? 1 : -1;
          });
          break;
        case 'sbiDesc':
          sort = this.filterResult.sort(function (a, b) {
            return parseInt(a.sbi) < parseInt(b.sbi) ? 1 : -1;
          });
          break;
        case "totAsc":
          sort = this.filterResult.sort(function (a, b) {
            return parseInt(a.tot) > parseInt(b.tot) ? 1 : -1;
          });
          break;
        case "totDesc":
          sort = this.filterResult.sort(function (a, b) {
            return parseInt(a.tot) < parseInt(b.tot) ? 1 : -1;
          });
          break;
        case "mdayAsc":
          sort = this.filterResult.sort(function (a, b) {
            return parseInt(a.mday) > parseInt(b.mday) ? 1 : -1;
          });
          break;
        case "mdayDesc":
          sort = this.filterResult.sort(function (a, b) {
            return parseInt(a.mday) < parseInt(b.mday) ? 1 : -1;
          });
          break;
      }
      this.filterResult = sort;
    },
    pageClick(item) {
      this.curPage = item;
    },
    pagePreClick() {
      this.curPage--;
    },
    pageNextClick() {
      this.curPage++;
    }
  }
});