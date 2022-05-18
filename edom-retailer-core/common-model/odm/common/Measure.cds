namespace sap.odm.common;

using {sap.odm.common.UnitOfMeasureCode} from '@sap/odm/dist/common/UnitOfMeasureCodes';

/* GDT excerpt:
 * Measure must not be confused with Quantity. In contrast to Measure, Quantity is used for the definition of quantity values or units.
 * Quantities can on the one hand be piece sizes, such as packets, containers, and so on but also physical sizes (meters, centimeters,
 * kilograms).
 */

/**
 * A Measure is a physical measurement with the corresponding
 * unit of measurement. Measure can only be used to specify
 * physical business sizes.
 */
type Measure : {
  /**
   * The numeric value of the measurement.
   */
  measure  : Double;
  /**
   * The unit in which the measurement is counted.
   */
  unitCode : UnitOfMeasureCode;
};


/**
 * A Measure is a physical measurement with the corresponding
 * unit of measurement based on fixed-point data type
 * Decimal(22,6). Measure can only be used to specify physical
 * business sizes.
 */
type MeasureDecimal : {
  /**
   * The numeric value of the measurement.
   */
  measure  : Decimal(22, 6);
  /**
   * The unit in which the measurement is counted.
   */
  unitCode : UnitOfMeasureCode;
};