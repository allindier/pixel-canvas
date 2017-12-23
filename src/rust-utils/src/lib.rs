#[no_mangle]
pub extern fn calculateOffset(coord: f32, offset: f32, old_zoom: f32, new_zoom: f32, size: f32) -> f32 {
    let new_value = size / new_zoom;

    let gap = size - new_value;
    let first_side = if offset < 0_f32 {
        0_f32
    } else if offset > gap {
        gap
    } else {
        offset
    };

    let mut second_side = offset + size / old_zoom - new_value;
    if second_side > gap {
        second_side = gap;
    } else if second_side < 0_f32 {
        second_side = 0_f32;
    }

    let mut new_offset = coord - new_value / 2_f32;
    if new_offset < first_side {
        new_offset = first_side;
    } else if new_offset > second_side {
        new_offset = second_side;
    }

    new_offset
}
