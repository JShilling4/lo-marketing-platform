
<template>
  <div style="position: relative; display: inline-block;">
    <div class="form-control" @click="togglePicker">
      <slot name="input" :startDate="start" :endDate="end" :ranges="ranges">
        <span class="rangeText">{{rangeText}}</span>
        <b class="caret"></b>
      </slot>
    </div>
    <transition name="slide-fade" mode="out-in">
      <div
        class="daterangepicker dropdown-menu ltr"
        :class="pickerStyles"
        v-if="open"
        v-on-clickaway="clickAway"
      >
        <div class="calendars row no-gutters">
          <slot name="ranges" v-if="ranges !== false">
            <calendar-ranges class="col-12 col-md-auto" @clickRange="clickRange" :ranges="ranges"></calendar-ranges>
          </slot>

          <div class="drp-calendar col left" :class="{single: singleDatePicker}">
            <div class="daterangepicker_input d-none d-sm-block" v-if="false">
              <input
                class="input-mini form-control"
                type="text"
                name="daterangepicker_start"
                :value="startText"
              >
              <i class="fa fa-calendar glyphicon glyphicon-calendar"></i>
            </div>
            <div class="calendar-table">
              <calendar
                :monthDate="monthDate"
                :locale="locale"
                :start="start"
                :end="end"
                :minDate="min"
                :maxDate="max"
                :show-dropdowns="showDropdowns"
                @nextMonth="nextMonth"
                @prevMonth="prevMonth"
                @change-month="changeLeftMonth"
                @dateClick="dateClick"
                @hoverDate="hoverDate"
                :showWeekNumbers="showWeekNumbers"
              />
            </div>
            <calendar-time
              v-if="timePicker"
              @update="onUpdateStartTime"
              :miniute-increment="timePickerIncrement"
              :hour24="timePicker24Hour"
              :second-picker="timePickerSeconds"
              :current-time="start"
            />
          </div>

          <div class="drp-calendar col right" v-if="!singleDatePicker">
            <div class="daterangepicker_input" v-if="false">
              <input
                class="input-mini form-control"
                type="text"
                name="daterangepicker_end"
                :value="endText"
              >
              <i class="fa fa-calendar glyphicon glyphicon-calendar"></i>
            </div>
            <div class="calendar-table">
              <calendar
                :monthDate="nextMonthDate"
                :locale="locale"
                :start="start"
                :end="end"
                :minDate="min"
                :maxDate="max"
                :show-dropdowns="showDropdowns"
                @nextMonth="nextMonth"
                @prevMonth="prevMonth"
                @change-month="changeRightMonth"
                @dateClick="dateClick"
                @hoverDate="hoverDate"
                :showWeekNumbers="showWeekNumbers"
              ></calendar>
            </div>
            <calendar-time
              v-if="timePicker"
              @update="onUpdateEndTime"
              :miniute-increment="timePickerIncrement"
              :hour24="timePicker24Hour"
              :second-picker="timePickerSeconds"
              :current-time="end"
            />
          </div>
        </div>

        <div class="drp-buttons" v-if="!autoApply">
          <span class="drp-selected">{{rangeText}}</span>
          <button
            class="cancelBtn btn btn-sm btn-default"
            type="button"
            @click="clickAway"
          >{{locale.cancelLabel}}</button>
          <button
            class="applyBtn btn btn-sm btn-success"
            :disabled="in_selection"
            type="button"
            @click="clickedApply"
          >{{locale.applyLabel}}</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
/* eslint-disable camelcase */
/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */
import moment from 'moment';
import { mixin as clickaway } from 'vue-clickaway';
import Calendar from './Calendar.vue';
import CalendarTime from './CalendarTime.vue';
import CalendarRanges from './CalendarRanges.vue';
import { nextMonth, prevMonth } from './util';

export default {
  components: { Calendar, CalendarTime, CalendarRanges },
  mixins: [clickaway],
  model: {
    prop: 'dateRange',
    event: 'update',
  },
  props: {
    placeholder: {
      type: Boolean,
      default() {
        return false;
      },
    },
    orderNum: {
      type: String,
    },
    customClass: {
      type: String,
    },
    minDate: {
      type: [String, Date],
      default() {
        return new Date(0);
      },
    },
    maxDate: {
      type: [String, Date],
      default() {
        return new Date(8640000000000000);
      },
    },
    showWeekNumbers: {
      type: Boolean,
      default: false,
    },
    singleDatePicker: {
      type: Boolean,
      default: false,
    },
    showDropdowns: {
      type: Boolean,
      default: false,
    },
    timePicker: {
      type: Boolean,
      default: false,
    },
    timePickerIncrement: {
      type: Number,
      default: 5,
    },
    timePicker24Hour: {
      type: Boolean,
      default: true,
    },
    timePickerSeconds: {
      type: Boolean,
      default: false,
    },
    autoApply: {
      type: Boolean,
      default: false,
    },
    localeData: {
      type: Object,
      default() {
        return {};
      },
    },
    dateRange: {
      // for v-model
      default: null,
    },
    startDate: {
      default() {
        return new Date();
      },
    },
    endDate: {
      default() {
        return new Date();
      },
    },
    ranges: {
      type: [Object, Boolean],
      default() {
        return {
          Today: [moment(), moment()],
          Yesterday: [
            moment().subtract(1, 'days'),
            moment().subtract(1, 'days'),
          ],
          'This month': [moment().startOf('month'), moment().endOf('month')],
          'This year': [moment().startOf('year'), moment().endOf('year')],
          'Last week': [
            moment()
              .subtract(1, 'week')
              .startOf('week'),
            moment()
              .subtract(1, 'week')
              .endOf('week'),
          ],
          'Last month': [
            moment()
              .subtract(1, 'month')
              .startOf('month'),
            moment()
              .subtract(1, 'month')
              .endOf('month'),
          ],
        };
      },
    },
    opens: {
      type: String,
      default: 'center',
    },
  },
  data() {
    const default_locale = {
      direction: 'ltr',
      format: moment.localeData().longDateFormat('L'),
      separator: ' - ',
      applyLabel: 'Apply',
      cancelLabel: 'Cancel',
      weekLabel: 'W',
      customRangeLabel: 'Custom Range',
      daysOfWeek: moment.weekdaysMin(),
      monthNames: moment.monthsShort(),
      firstDay: moment.localeData().firstDayOfWeek(),
    };

    // let data = { locale: _locale }
    const data = { locale: { ...default_locale, ...this.localeData } };

    let { startDate } = this;
    let { endDate } = this;
    if (this.dateRange !== null) {
      startDate = this.dateRange.startDate;
      endDate = this.dateRange.endDate;
    }

    data.monthDate = new Date(startDate);
    data.start = new Date(startDate);
    if (this.singleDatePicker) {
      // ignore endDate for singleDatePicker
      data.end = new Date(startDate);
    } else {
      data.end = new Date(endDate);
    }
    data.in_selection = false;
    data.open = false;

    // update day names order to firstDay
    if (data.locale.firstDay !== 0) {
      let iterator = data.locale.firstDay;
      while (iterator > 0) {
        data.locale.daysOfWeek.push(data.locale.daysOfWeek.shift());
        iterator -= 1;
      }
    }
    return data;
  },
  methods: {
    changeMonth(newDate) {
      const max = new Date(this.max);
      const min = new Date(this.min);
      // check min
      if (moment(newDate).isBetween(min, max)) {
        this.monthDate = newDate;
      } else if (moment(newDate).isAfter(max)) {
        this.monthDate = new Date(max);
      } else {
        this.monthDate = new Date(min);
      }
    },
    nextMonth() {
      this.changeMonth(
        nextMonth(
          new Date(this.monthDate.getFullYear(), this.monthDate.getMonth(), 1),
        ),
      );
    },
    prevMonth() {
      this.changeMonth(
        prevMonth(
          new Date(this.monthDate.getFullYear(), this.monthDate.getMonth(), 1),
        ),
      );
    },
    changeLeftMonth(value) {
      const newDate = new Date(value.year, value.month, 1);
      this.changeMonth(newDate);
    },
    changeRightMonth(value) {
      if (value.month <= 0) {
        value.month = 11;
        value.year -= 1;
      } else {
        value.month -= 1;
      }
      this.changeMonth(value);
    },
    normalizeDatetime(value, oldValue) {
      const newDate = new Date(value);
      if (this.timePicker) {
        newDate.setHours(oldValue.getHours());
        newDate.setMinutes(oldValue.getMinutes());
        newDate.setSeconds(oldValue.getSeconds());
        newDate.setMilliseconds(oldValue.getMilliseconds());
      }

      return newDate;
    },
    dateClick(value) {
      if (this.in_selection) {
        this.in_selection = false;
        this.end = this.normalizeDatetime(value, this.end);

        if (this.end < this.start) {
          this.in_selection = true;
          this.start = this.normalizeDatetime(value, this.start);
        }
        if (!this.in_selection && this.autoApply) {
          this.clickedApply();
        }
      } else {
        this.start = this.normalizeDatetime(value, this.start);
        this.end = this.normalizeDatetime(value, this.end);
        if (!this.singleDatePicker) {
          this.in_selection = true;
        } else if (this.autoApply) {
          this.clickedApply();
        }
      }
    },
    hoverDate(value) {
      const dt = this.normalizeDatetime(value, this.end);
      if (this.in_selection && dt > this.start) {
        this.end = dt;
      }
    },
    togglePicker() {
      this.open = !this.open;
    },
    clickedApply() {
      this.open = false;
      this.$emit('update', { startDate: this.start, endDate: this.end });
    },
    clickAway() {
      if (this.open) {
        // reset start and end
        let { startDate } = this;
        let { endDate } = this;
        if (this.dateRange !== null) {
          startDate = this.dateRange.startDate;
          endDate = this.dateRange.endDate;
        }
        this.start = new Date(startDate);
        this.end = new Date(endDate);
        this.open = false;
      }
    },
    clickRange(value) {
      this.start = new Date(value[0]);
      this.end = new Date(value[1]);
      this.monthDate = new Date(value[0]);
      if (this.autoApply) {
        this.clickedApply();
      }
    },
    onUpdateStartTime(value) {
      const start = new Date(this.start);
      start.setHours(value.hours);
      start.setMinutes(value.minutes);
      start.setSeconds(value.seconds);

      this.start = start;
    },
    onUpdateEndTime(value) {
      const end = new Date(this.end);
      end.setHours(value.hours);
      end.setMinutes(value.minutes);
      end.setSeconds(value.seconds);

      this.end = end;
    },
  },
  computed: {
    nextMonthDate() {
      return nextMonth(this.monthDate);
    },
    startText() {
      // return this.start.toLocaleDateString()
      return moment(this.start).format(this.locale.format);
    },
    endText() {
      // return new Date(this.end).toLocaleDateString()
      return moment(new Date(this.end)).format(this.locale.format);
    },
    rangeText() {
      let range;
      if (this.placeholder) {
        range = 'Assign';
      } else {
        range = this.startText;
      }
      if (!this.singleDatePicker) {
        range += ` ${this.locale.separator} ${this.endText}`;
      }
      return range;
    },
    min() {
      return this.minDate ? new Date(this.minDate) : null;
    },
    max() {
      return this.maxDate ? new Date(this.maxDate) : null;
    },
    pickerStyles() {
      return {
        'show-calendar': this.open,
        'show-ranges': !!this.ranges,
        'show-weeknumbers': this.showWeekNumbers,
        single: this.singleDatePicker,
        opensright: this.opens === 'right',
        opensleft: this.opens === 'left',
        openscenter: this.opens === 'center',
        assignPicker: this.customClass,
      };
    },
  },
  watch: {
    startDate(value) {
      this.start = new Date(value);
    },
    endDate(value) {
      this.end = new Date(value);
    },
    // eslint-disable-next-line no-unused-vars
    minDate(value) {
      this.changeMonth(this.monthDate);
    },
    maxDate(value) {
      this.changeMonth(this.monthDate);
    },
    dateRange(value) {
      if (value) {
        if (value.startDate) {
          this.start = new Date(value.startDate);
        }
        if (value.endDate) {
          this.end = new Date(value.endDate);
        }
      }
    },
  },
};
</script>

<style lang="scss">
.daterangepicker {
  position: absolute;
  color: inherit;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #ddd;
  width: 278px;
  max-width: none;
  padding: 0;
  margin-top: 7px;
  top: 100px;
  left: 20px;
  z-index: 3001;
  display: none;
  font-size: 15px;
  line-height: 1em;
}

.daterangepicker:before,
.daterangepicker:after {
  position: absolute;
  display: inline-block;
  border-bottom-color: rgba(0, 0, 0, 0.2);
  content: "";
}

.daterangepicker:before {
  // top: -7px;
  border-right: 7px solid transparent;
  border-left: 7px solid transparent;
  border-top: 7px solid #ccc;
}

.daterangepicker:after {
  // top: -6px;
  // border-right: 6px solid transparent;
  // border-bottom: 6px solid #fff;
  // border-left: 6px solid transparent;
}

.daterangepicker.opensleft:before {
  right: 9px;
}

.daterangepicker.opensleft:after {
  right: 10px;
}

.daterangepicker.openscenter:before {
  left: 0;
  right: 0;
  bottom: -8px;
  width: 0;
  margin-left: auto;
  margin-right: auto;
}

.daterangepicker.openscenter:after {
  left: 0;
  right: 0;
  width: 0;
  margin-left: auto;
  margin-right: auto;
}

.daterangepicker.opensright:before {
  left: 9px;
}

.daterangepicker.opensright:after {
  left: 10px;
}

.daterangepicker.drop-up {
  margin-top: -7px;
}

.daterangepicker.drop-up:before {
  top: initial;
  bottom: -7px;
  border-bottom: initial;
  border-top: 7px solid #ccc;
}

.daterangepicker.drop-up:after {
  top: initial;
  bottom: -6px;
  border-bottom: initial;
  border-top: 6px solid #fff;
}

.daterangepicker.single .daterangepicker .ranges,
.daterangepicker.single .drp-calendar {
  float: none;
}

.daterangepicker.single .drp-selected {
  display: none;
}

.daterangepicker.show-calendar .drp-calendar {
  display: block;
}

.daterangepicker.show-calendar .drp-buttons {
  display: block;
}

.daterangepicker.auto-apply .drp-buttons {
  display: none;
}

.daterangepicker .drp-calendar {
  display: none;
  max-width: 270px;
}

.daterangepicker .drp-calendar.left {
  padding: 8px 0 8px 8px;
}

.daterangepicker .drp-calendar.right {
  padding: 8px;
}

.daterangepicker .drp-calendar.single .calendar-table {
  border: none;
}

.daterangepicker .calendar-table .next span,
.daterangepicker .calendar-table .prev span {
  color: #fff;
  border: solid black;
  border-width: 0 2px 2px 0;
  border-radius: 0;
  display: inline-block;
  padding: 3px;
}

.daterangepicker .calendar-table .next span {
  transform: rotate(-45deg);
  -webkit-transform: rotate(-45deg);
}

.daterangepicker .calendar-table .prev span {
  transform: rotate(135deg);
  -webkit-transform: rotate(135deg);
}

.daterangepicker .calendar-table th,
.daterangepicker .calendar-table td {
  white-space: nowrap;
  text-align: center;
  vertical-align: middle;
  min-width: 32px;
  width: 32px;
  height: 24px;
  line-height: 24px;
  font-size: 12px;
  border-radius: 4px;
  border: 1px solid transparent;
  white-space: nowrap;
  cursor: pointer;
}

.daterangepicker .calendar-table {
  border: 1px solid #fff;
  border-radius: 4px;
  background-color: #fff;
}

.daterangepicker .calendar-table table {
  width: 100%;
  margin: 0;
  border-spacing: 0;
  border-collapse: collapse;
}

.daterangepicker td.available:hover,
.daterangepicker th.available:hover {
  background-color: #eee;
  border-color: transparent;
  color: inherit;
}

.daterangepicker td.week,
.daterangepicker th.week {
  font-size: 80%;
  color: #ccc;
}

.daterangepicker td.off,
.daterangepicker td.off.in-range,
.daterangepicker td.off.start-date,
.daterangepicker td.off.end-date {
  background-color: #fff;
  border-color: transparent;
  color: #999;
}

.daterangepicker td.in-range {
  background-color: $linkBlue-faded;
  border-color: transparent;
  color: #fff;
  border-radius: 0;
}

.daterangepicker td.start-date {
  background-color: $linkBlue!important;
  border-radius: 50% 0 0 50%;
}

.daterangepicker td.end-date {
  background-color: $linkBlue!important;
  border-radius: 0 50% 50% 0;
}

.daterangepicker td.start-date.end-date {
  background-color: $linkBlue;
  border-radius: 50%;
}

.daterangepicker td.active,
.daterangepicker td.active:hover {
  background-color: #357ebd;
  border-color: transparent;
  color: #fff;
}

.daterangepicker th.month {
  width: auto;
}

.daterangepicker td.disabled,
.daterangepicker option.disabled {
  color: #999;
  cursor: not-allowed;
  text-decoration: line-through;
}

.daterangepicker select.monthselect,
.daterangepicker select.yearselect {
  font-size: 12px;
  padding: 1px;
  height: auto;
  margin: 0;
  cursor: default;
}

.daterangepicker select.monthselect {
  margin-right: 2%;
  width: 56%;
}

.daterangepicker select.yearselect {
  width: 40%;
}

.daterangepicker select.hourselect,
.daterangepicker select.minuteselect,
.daterangepicker select.secondselect,
.daterangepicker select.ampmselect {
  width: 50px;
  margin: 0 auto;
  background: #eee;
  border: 1px solid #eee;
  padding: 2px;
  outline: 0;
  font-size: 12px;
}

.daterangepicker .calendar-time {
  text-align: center;
  margin: 4px auto 0 auto;
  line-height: 30px;
  position: relative;
}

.daterangepicker .calendar-time select.disabled {
  color: #ccc;
  cursor: not-allowed;
}

.daterangepicker .drp-buttons {
  clear: both;
  text-align: right;
  padding: 8px;
  border-top: 1px solid #ddd;
  display: none;
  line-height: 12px;
  vertical-align: middle;
}

.daterangepicker .drp-selected {
  display: inline-block;
  font-size: 12px;
  padding-right: 8px;
}

.daterangepicker .drp-buttons .btn {
  margin-left: 8px;
  font-size: 12px;
  font-weight: bold;
  padding: 4px 8px;
}

.daterangepicker.show-ranges .drp-calendar.left {
  border-left: 1px solid #ddd;
}

.daterangepicker .ranges {
  float: none;
  text-align: left;
  margin: 0;
}

.daterangepicker.show-calendar .ranges {
  margin-top: 8px;
}

.daterangepicker .ranges ul {
  list-style: none;
  margin: 0 auto;
  padding: 0;
  width: 100%;
}

.daterangepicker .ranges li {
  font-size: 12px;
  padding: 8px 12px;
  cursor: pointer;
}

.daterangepicker .ranges li:hover {
  background-color: #eee;
}

.daterangepicker .ranges li.active {
  background-color: #08c;
  color: #fff;
}

// Custom
.picker .rangeText {
  color: $linkBlue;
  font-size: .9em;
  font-weight: normal;
  cursor: pointer;
}
// .dueDatePicker {
//   top: 50%;
//   left: 50%;
//   z-index: 100;

// }
.dueDate-datepicker .rangeText {
  text-decoration: underline;
}

/*  Larger Screen Styling */
@media (min-width: 564px) {
  .daterangepicker {
    width: auto;
  }
  .daterangepicker .ranges ul {
    width: 140px;
  }
  .daterangepicker.single .ranges ul {
    width: 100%;
  }
  .daterangepicker.single .drp-calendar.left {
    clear: none;
  }
  .daterangepicker.single.ltr .ranges,
  .daterangepicker.single.ltr .drp-calendar {
    float: left;
  }
  .daterangepicker.single.rtl .ranges,
  .daterangepicker.single.rtl .drp-calendar {
    float: right;
  }
  .daterangepicker.ltr {
    direction: ltr;
    text-align: left;
  }
  .daterangepicker.ltr .drp-calendar.left {
    clear: left;
    margin-right: 0;
  }
  .daterangepicker.ltr .drp-calendar.left .calendar-table {
    border-right: none;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  .daterangepicker.ltr .drp-calendar.right {
    margin-left: 0;
  }
  .daterangepicker.ltr .drp-calendar.right .calendar-table {
    border-left: none;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
  .daterangepicker.ltr .drp-calendar.left .calendar-table {
    padding-right: 8px;
  }
  .daterangepicker.ltr .ranges,
  .daterangepicker.ltr .drp-calendar {
    float: left;
  }
  .daterangepicker.rtl {
    direction: rtl;
    text-align: right;
  }
  .daterangepicker.rtl .drp-calendar.left {
    clear: right;
    margin-left: 0;
  }
  .daterangepicker.rtl .drp-calendar.left .calendar-table {
    border-left: none;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
  .daterangepicker.rtl .drp-calendar.right {
    margin-right: 0;
  }
  .daterangepicker.rtl .drp-calendar.right .calendar-table {
    border-right: none;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  .daterangepicker.rtl .drp-calendar.left .calendar-table {
    padding-left: 12px;
  }
  .daterangepicker.rtl .ranges,
  .daterangepicker.rtl .drp-calendar {
    text-align: right;
    float: right;
  }
}
@media (min-width: 730px) {
  .daterangepicker .ranges {
    width: auto;
  }
  .daterangepicker.ltr .ranges {
    float: left;
  }
  .daterangepicker.rtl .ranges {
    float: right;
  }
  .daterangepicker .drp-calendar.left {
    clear: none !important;
  }
}
</style>

<style lang="scss" scoped>
$week-width: 682px - 628px;

.reportrange-text {
  background: #fff;
  cursor: pointer;
  padding: 5px 10px;
  border: 1px solid #ccc;
  width: 100%;
}

.daterangepicker {
  flex-direction: column;
  display: flex;
  width: auto;

  @media screen and (max-width: 768px) {
    &.show-ranges {
      .drp-calendar.left {
        border-left: 0px;
      }

      .ranges {
        border-bottom: 1px solid #ddd;

        ::v-deep ul {
          display: flex;
          flex-wrap: wrap;
          width: auto;
        }
      }
    }
  }

  @media screen and (min-width: 540px) {
    min-width: 486px;
    &.show-weeknumbers {
      min-width: 490px + $week-width;
    }
  }

  @media screen and (min-width: 768px) {
    &.show-ranges {
      min-width: 628px;

      &.show-weeknumbers {
        min-width: 628px + $week-width;
      }
    }
  }

  &.single {
    @media screen and (max-width: 340px) {
      min-width: 250px;

      &.show-weeknumbers {
        min-width: 250px + $week-width;
      }
    }

    @media screen and (min-width: 339px) {
      min-width: auto;
      &.show-ranges {
        min-width: 328px;

        &.show-weeknumbers {
          min-width: 328px + $week-width;
        }

        .drp-calendar.left {
          border-left: 1px solid #ddd;
        }

        .ranges {
          width: auto;
          max-width: none;
          flex-basis: auto;
          border-bottom: 0;

          ::v-deep ul {
            display: block;
            width: 100%;
          }
        }
      }
    }
  }

  &.show-calendar {
    display: block;
  }
}

div.daterangepicker.opensleft {
  top: 35px;
  right: 10px;
  left: auto;
}

div.daterangepicker.openscenter {
  top: -308px;
  right: auto;
  left: 50%;
  transform: translate(-50%, 0);
  box-shadow: 0 8px 16px rgba(0,0,0,.4);
}

div.daterangepicker.opensright {
  top: 35px;
  left: 10px;
  right: auto;
}

.cancelBtn {
  color: $red;
  border-color: $red;
}
.applyBtn {
  color: $orange;
  border-color: $orange;
}

/* Enter and leave animations can use different */
/* durations and timing functions.              */
.slide-fade-enter-active {
  transition: all 0.2s ease;
}

.slide-fade-leave-active {
  transition: all 0.1s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter, .slide-fade-leave-to
        /* .slide-fade-leave-active for <2.1.8 */
 {
  transform: translateX(10px);
  opacity: 0;
}


div.daterangepicker.assignPicker {
  top: 30px;
  &:before {
    left: 0;
    right: 0;
    top: -8px;
    bottom: unset;
    width: 0;
    margin-left: auto;
    margin-right: auto;
    border-bottom: 7px solid #ccc;
    border-top: none;
  }
}

</style>
